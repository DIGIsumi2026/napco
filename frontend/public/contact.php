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

function emailHtml(string $heading, array $details, string $messageLabel, string $message): string
{
    $rows = '';
    foreach ($details as $label => $value) {
        $rows .= '<tr><th style="padding:10px 16px;text-align:left;vertical-align:top;color:#536274;width:170px">'
            . escapeHtml($label) . '</th><td style="padding:10px 16px;color:#07172d">'
            . escapeHtml($value) . '</td></tr>';
    }

    return '<!doctype html><html lang="en"><head><meta charset="UTF-8"></head>'
        . '<body style="margin:0;padding:24px;background:#f4f8fc;font-family:Arial,sans-serif;color:#07172d">'
        . '<div style="max-width:640px;margin:auto;padding:28px;background:#fff;border:1px solid #dce6ef">'
        . '<h1 style="margin:0 0 20px;font-size:24px;color:#0053a0">' . escapeHtml($heading) . '</h1>'
        . '<table style="width:100%;border-collapse:collapse">' . $rows . '</table>'
        . '<h2 style="margin:28px 0 10px;font-size:16px">' . escapeHtml($messageLabel) . '</h2>'
        . '<p style="margin:0;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere">'
        . escapeHtml($message) . '</p></div></body></html>';
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
    $mail->Body = emailHtml($heading, $details, $messageLabel, $message);
    $mail->AltBody = $plainBody;

    if (!$mail->send()) {
        throw new RuntimeException('Mail delivery failed');
    }

    respond(200, true, 'Your message has been sent successfully.');
} catch (Throwable $error) {
    error_log('NAPCO contact mail failed: ' . get_class($error));
    respond(503, false, "We couldn't send your message right now. Please try again.");
}
