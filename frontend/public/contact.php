<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success, string $message): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function rawField(string $name): ?string
{
    $value = $_POST[$name] ?? null;
    return is_string($value) ? $value : null;
}

function field(string $name): ?string
{
    $value = rawField($name);
    return $value === null ? null : trim($value);
}

function headerField(string $name): ?string
{
    $value = rawField($name);
    return $value === null || preg_match('/[\r\n]/', $value) === 1 ? null : trim($value);
}

function validText(?string $value, int $limit): bool
{
    if ($value === null || $value === '' || preg_match('//u', $value) !== 1 || str_contains($value, "\0")) {
        return false;
    }

    $length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
    return $length <= $limit;
}

function validHeaderText(?string $value, int $limit): bool
{
    return validText($value, $limit) && preg_match('/[\x00-\x1F\x7F]/', $value) !== 1;
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}


 /* Server-rendered, table-based HTML for common email clients */
function emailHtml(
    string $formType,
    array $details,
    string $messageLabel,
    string $message,
    ?int $rating,
    bool $hasLogo
): string {
    $isFeedback = $formType === 'feedback';
    $title = $isFeedback ? 'Feedback Received' : 'Enquiry Received';
    $description = $isFeedback
        ? 'A new customer feedback submission has been received through the NAPCO website.'
        : 'A new website enquiry has been received through the NAPCO website.';
    $icon = $isFeedback ? '&#8226;&#8226;&#8226;' : '&#9993;';

    $rows = '';
    foreach ($details as $label => $value) {
        $cellContent = escapeHtml($value);

        if ($label === 'Email') {
            $safeEmail = escapeHtml($value);
            $cellContent = '<a href="mailto:' . $safeEmail . '" '
                . 'style="color:#0066c9;text-decoration:underline;word-break:break-word">'
                . $safeEmail . '</a>';
        }

        if ($label === 'Rating' && $rating !== null) {
            $stars = '';
            for ($i = 1; $i <= 5; $i++) {
                $active = $i <= $rating;
                $stars .= '<span style="font-size:23px;line-height:1.2;color:'
                    . ($active ? '#f3b700' : '#a8b8cd') . '">'
                    . ($active ? '&#9733;' : '&#9734;') . '</span>';
            }
            $cellContent = '<span style="display:inline-block;margin-right:12px;color:#172a45;white-space:nowrap">'
                . $rating . ' / 5 Stars</span>'
                . '<span style="display:inline-block;white-space:nowrap;letter-spacing:2px">' . $stars . '</span>';
        }

        $rows .= '<tr>'
            . '<th scope="row" valign="top" align="left" bgcolor="#edf3f9" '
            . 'style="width:32%;padding:13px 16px;border-bottom:1px solid #dce5ef;'
            . 'font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;'
            . 'font-weight:700;color:#405673">' . escapeHtml($label) . '</th>'
            . '<td valign="top" align="left" bgcolor="#ffffff" '
            . 'style="padding:13px 16px;border-bottom:1px solid #dce5ef;'
            . 'font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;'
            . 'color:#112846;word-break:break-word">' . $cellContent . '</td>'
            . '</tr>';
    }

    $logo = $hasLogo
        ? '<img src="cid:napco-email-logo" width="260" alt="NAPCO - Your Impression is Our Responsibility" '
            . 'style="display:block;width:260px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none">'
        : '<span style="font-family:Arial,Helvetica,sans-serif;font-size:34px;'
            . 'font-weight:800;font-style:italic;color:#0062b2">napco</span>';

    $safeMessage = nl2br(escapeHtml($message), false);

    // Inline styles

    return '<!doctype html><html lang="en"><head><meta charset="UTF-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:0;background-color:#f3f8fc;color:#112846;'
        . 'font-family:Arial,Helvetica,sans-serif">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        . 'bgcolor="#f3f8fc" style="width:100%;border-collapse:collapse;background-color:#f3f8fc">'
        . '<tr><td align="center" style="padding:28px 12px">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        . 'style="width:100%;max-width:640px;border-collapse:separate;'
        . 'border:1px solid #e0e9f2;border-radius:14px;background-color:#ffffff">'
        
        . '<tr><td align="center" bgcolor="#ffffff" '
        . 'style="padding:23px 22px 19px;border-radius:14px 14px 0 0">' . $logo . '</td></tr>'
        
        . '<tr><td bgcolor="#eef6ff" style="padding:25px 25px 27px;background-color:#eef6ff;'
        . 'border-top:1px solid #e2edf8">'
        . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">'
        . '<tr><td valign="middle" width="74" style="width:74px;vertical-align:middle">'
        . '<table role="presentation" width="59" height="59" cellspacing="0" cellpadding="0" '
        . 'border="0" bgcolor="#086ad0" style="border-radius:50%;background-color:#086ad0">'
        . '<tr><td align="center" valign="middle" style="color:#ffffff;'
        . 'font-family:Arial,Helvetica,sans-serif;font-size:27px;font-weight:bold;'
        . 'line-height:59px;text-align:center">' . $icon . '</td></tr></table>'
        . '</td><td valign="middle" style="vertical-align:middle">'
        . '<h1 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;'
        . 'font-size:26px;line-height:32px;font-weight:700;color:#0751a2">'
        . escapeHtml($title) . '</h1>'
        . '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;'
        . 'font-size:14px;line-height:22px;color:#445770">'
        . escapeHtml($description) . '</p></td></tr></table></td></tr>'
        //Data table
        . '<tr><td style="padding:23px 23px 13px">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
        . 'border="0" style="width:100%;border-collapse:collapse;'
        . 'border:1px solid #dce5ef">' . $rows . '</table>'
        . '</td></tr>'
        //message panel
        . '<tr><td style="padding:6px 23px 23px">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        . 'bgcolor="#f1f6fc" style="width:100%;background-color:#f1f6fc;border-radius:9px">'
        . '<tr><td style="padding:19px 19px 12px">'
        . '<h2 style="margin:0;font-family:Arial,Helvetica,sans-serif;'
        . 'font-size:18px;line-height:24px;color:#0751a2">'
        . '&#9632;&nbsp; ' . escapeHtml($messageLabel) . '</h2></td></tr>'
        . '<tr><td style="padding:0 16px 16px">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        . 'bgcolor="#ffffff" style="width:100%;background-color:#ffffff;border-radius:7px">'
        . '<tr><td style="padding:16px;font-family:Arial,Helvetica,sans-serif;'
        . 'font-size:14px;line-height:23px;color:#172b46;'
        . 'word-break:break-word">' . $safeMessage . '</td></tr></table>'
        . '</td></tr></table></td></tr>'
        //notification footer
        . '<tr><td align="center" style="padding:15px 20px 19px;'
        . 'border-top:1px solid #e3eaf2;font-family:Arial,Helvetica,sans-serif;'
        . 'font-size:12px;line-height:18px;color:#71829a">'
        . 'This is an automated notification from the NAPCO website.'
        . '</td></tr></table></td></tr></table></body></html>';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    respond(413, false, 'Please check the submitted information.');
}

$honeypot = $_POST['website'] ?? '';
if (!is_string($honeypot) || $honeypot !== '') {
    respond(200, true, 'Your message has been sent successfully.');
}

$formType = rawField('formType');
if (!in_array($formType, ['feedback', 'enquiry'], true)) {
    respond(400, false, 'Please check the submitted information.');
}

$submittedAt = (new DateTimeImmutable('now', new DateTimeZone('Asia/Colombo')))->format('Y-m-d H:i:s T');
$rating = null;

if ($formType === 'feedback') {
    $name = headerField('feedbackName');
    $email = headerField('feedbackEmail');
    $ratingValue = rawField('feedbackRating');
    $message = field('feedbackMessage');

    if (!validHeaderText($name, 100) || !validHeaderText($email, 254)
        || filter_var($email, FILTER_VALIDATE_EMAIL) === false
        || $ratingValue === null || preg_match('/\A[1-5]\z/', $ratingValue) !== 1
        || !validText($message, 5000)) {
        respond(400, false, 'Please check the submitted information.');
    }

    $rating = (int) $ratingValue;
    $subject = "New NAPCO Website Feedback - {$rating} Stars";
    $details = [
        'Name' => $name,
        'Email' => $email,
        'Rating' => $rating . ' / 5 Stars  ' . str_repeat('★', $rating) . str_repeat('☆', 5 - $rating),
        'Submitted' => $submittedAt,
    ];
    $heading = 'NAPCO Website Feedback';
    $messageLabel = 'Feedback Message';
} else {
    $name = headerField('enquiryName');
    $email = headerField('enquiryEmail');
    $phone = headerField('enquiryPhone');
    $service = rawField('enquiryService');
    $message = field('enquiryMessage');
    $allowedServices = [
        'Newspaper Printing',
        'Books and Publishing',
        'Brochures and Catalogues',
        'Posters and Leaflets',
        'Calendars and Diaries',
        'Labels and Annual Reports',
        'Commercial Printing',
        'Printing and Packaging',
    ];

    if (!validHeaderText($name, 100) || !validHeaderText($email, 254)
        || filter_var($email, FILTER_VALIDATE_EMAIL) === false
        || (isset($_POST['enquiryPhone']) && $phone === null)
        || ($phone !== null && $phone !== '' && !validHeaderText($phone, 40))
        || !in_array($service, $allowedServices, true)
        || !validText($message, 5000)) {
        respond(400, false, 'Please check the submitted information.');
    }

    $subject = 'New NAPCO Website Enquiry - ' . $service;
    $details = [
        'Name' => $name,
        'Email' => $email,
        'Phone' => $phone === null || $phone === '' ? 'Not provided' : $phone,
        'Service Interested In' => $service,
        'Submitted' => $submittedAt,
    ];
    $heading = 'NAPCO Website Enquiry';
    $messageLabel = 'Enquiry Message';
}

$plainBody = $heading . "\n\n";
foreach ($details as $label => $value) {
    $plainBody .= $label . ': ' . $value . "\n";
}
$plainBody .= "\n" . $messageLabel . ":\n" . $message;

try {
    if (!is_file(__DIR__ . '/vendor/autoload.php') || !is_file(dirname(__DIR__) . '/smtp-config.php')) {
        throw new RuntimeException('Mail dependencies unavailable');
    }

    require __DIR__ . '/vendor/autoload.php';
    $config = require dirname(__DIR__) . '/smtp-config.php';

    if (!is_array($config)
        || ($config['host'] ?? null) !== 'smtp.gmail.com'
        || ($config['port'] ?? null) !== 465
        || ($config['username'] ?? null) !== 'digitalsumathi2026@gmail.com'
        || ($config['from_email'] ?? null) !== 'digitalsumathi2026@gmail.com'
        || ($config['from_name'] ?? null) !== 'NAPCO Website'
        || !is_string($config['password'] ?? null)
        || $config['password'] === ''
        || $config['password'] === 'REPLACE_WITH_GOOGLE_APP_PASSWORD') {
        throw new RuntimeException('Mail configuration invalid');
    }

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress('digitalsumathi2026@gmail.com');
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);
    $mail->Subject = $subject;

    //email-only image
    $logoPath = dirname(__DIR__) . '/email-assets/napco-email-logo.png';
    $hasLogo = is_readable($logoPath);
    if ($hasLogo) {
        $mail->addEmbeddedImage($logoPath, 'napco-email-logo', 'napco-email-logo.png', 'base64', 'image/png');
    } else {
        error_log('NAPCO email logo missing; delivering unbranded fallback.');
    }

    $mail->Body = emailHtml($formType, $details, $messageLabel, $message, $rating, $hasLogo);
    $mail->AltBody = $plainBody;

    if (!$mail->send()) {
        throw new RuntimeException('Mail delivery failed');
    }

    respond(200, true, 'Your message has been sent successfully.');
} catch (Throwable $error) {
    error_log('NAPCO contact mail failed: ' . get_class($error));
    respond(503, false, "We couldn't send your message right now. Please try again.");
}
