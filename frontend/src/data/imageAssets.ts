// home page 
//hero
import nlogo from '../assets/images/nlogo.png';
import building1 from '../assets/images/building-1.jpg';
import building2 from '../assets/images/building-2.jpg';
import building3 from '../assets/images/building-3.jpg';
import building4 from '../assets/images/building-4.jpg';
import building5 from '../assets/images/building-5.jpg';

//about us 
import napcoLogoRevealThumb from "../assets/images/napco-logo-reveal-thumb.png";

//service stat
import servicePrinter3d from "../assets/images/service-printer-3d.png";
import servicePapers3d from "../assets/images/service-papers-3d.png";
import serviceCartridges3d from "../assets/images/service-cartridges-3d.png";
import serviceCartridges23d from "../assets/images/service-cartridges2-3d.png";

//visual gallery 
import  newspaperPrintingWide from "../assets/images/newspaper-printing-wide.png";
import  booksPublishingWide from "../assets/images/books-publishing-wide.png";
import  commercialPrintingWide from "../assets/images/commercial-printing-wide.png";
import  labelsCloseup from "../assets/images/labels-closeup.png";
import  calendarsDiariesCloseup from "../assets/images/calendars-diaries-closeup.png";
import  annualReportsCloseup from "../assets/images//annual-reports-closeup.png";

//contact cta
import  ctaOpenBook from "../assets/images/cta-open-book.png";
import   ctaTag from "../assets/images/cta-tag.png";
import   ctaCmykStrip from "../assets/images/cta-cmyk-strip.png";
import   ctaCalendar from "../assets/images/cta-calendar.png";
import   ctaBookStack from "../assets/images/cta-book-stack.png";

//clients
import client1 from "../assets/images/clients/client-1.png";
import client2 from "../assets/images/clients/client-2.png";
import client3 from "../assets/images/clients/client-3.png";
import client4 from "../assets/images/clients/client-4.png";
import client5 from "../assets/images/clients/client-5.png";
import client6 from "../assets/images/clients/client-6.png";
import client7 from "../assets/images/clients/client-7.png";
import client8 from "../assets/images/clients/client-8.png";
import client9 from "../assets/images/clients/client-9.png";
import client10 from "../assets/images/clients/client-10.png";
import client11 from "../assets/images/clients/client-11.png";
import client12 from "../assets/images/clients/client-12.png";
import client13 from "../assets/images/clients/client-13.png";
import client14 from "../assets/images/clients/client-14.png";





export const imageAssets = {
  logo: {
    main: nlogo,
  },
  hero: {
    img1: building1,
    img2: building2,
    img3: building3,
    img4: building4,
    img5: building5,
  },

  about:{
    logoRevealThumbnail: napcoLogoRevealThumb,
  },

  services:{
    floating:{
      printer: servicePrinter3d,
      papers: servicePapers3d,
      cartridges: serviceCartridges3d,
      cartridges2: serviceCartridges23d,
    },
    visual:{
      newspaperPrinting: newspaperPrintingWide,
      booksPublishing: booksPublishingWide,
      commercialPrinting: commercialPrintingWide,
      labelsCloseup,
      calendarsDiaries: calendarsDiariesCloseup,
      annualReports: annualReportsCloseup,
    }
  },
  contactCta:{
     openBook: ctaOpenBook,
    tag: ctaTag,
    cmykStrip: ctaCmykStrip,
    calendar: ctaCalendar,
    bookStack: ctaBookStack,
  },
  clients:{
    client1,
    client2,
    client3,
    client4,
    client5,
    client6,
    client7,
    client8,
    client9,
    client10,
    client11,
    client12,
    client13,
    client14,
  }
} as const;