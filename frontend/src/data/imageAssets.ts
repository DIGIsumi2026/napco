import nlogo from '../assets/images/nlogo.png';
import building1 from '../assets/images/building-1.jpg';
import building2 from '../assets/images/building-2.jpg';
import building3 from '../assets/images/building-3.jpg';
import building4 from '../assets/images/building-4.jpg';
import building5 from '../assets/images/building-5.jpg';

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
} as const;
