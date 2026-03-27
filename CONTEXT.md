# Project Context: SplitFlapNinja

## Concept
This project was born out of a desire to recreate the iconic, vintage split-flap displays found in classic train stations and airports. The initial requirement was to create a fully static web application with a deep industrial aesthetic, specifically tailored to run beautifully on a 1024x600 screen (like the classic Acer Aspire One ZG5 netbook), using a stark contrast of dark backgrounds, grayish-white texts, and cyan accents.

## Technical Architecture

### HTML structure
A straightforward semantic structure. Includes a configuration interface (a textarea with limiting rules, preview/share/launch buttons) and the `1024x600` wrapper layout for the board.

### CSS Styling
- **3D Flaps:** Utilizes 3D transforms (`rotateX(90deg)`) tightly synced with CSS keyframe animations. The flap elements are split into a static `top` and `bottom` half, and two animating halves (`flip-top` and `flip-bottom`) to simulate physical movement.
- **Responsive Typography:** Text sizing relies strictly on modern `cqh` (Container Query Height) units, ensuring the 80px visual font scales perfectly into any viewport without external JavaScript resizing.
- **Hardware Aesthetics:** Deep `box-shadow` values stack inner gradients to emulate an industrial, metallic casing holding the recessed mechanical board inside it. 

### JavaScript Animation Engine
An object-oriented engine where a `Board` class manages a 5x18 matrix of `Flap` instances. 
- **Character Cycling:** To simulate mechanical nature, if a flap needs to change from 'A' to 'C', it passes physically through 'B'. Existing characters are forced to perform complete 360 cycles periodically to simulate an endless mechanical loop refresh, while empty spaces remain static to prevent visual noise.
- **Input Filtering:** Strict alphanumeric (plus hyphen and space) filtering ensures the board never breaks out of its capabilities.

## Future Plans
- Continued refinements to the CSS lighting depending on monitor brightness.
- Audio implementations for the clacking sounds of the flaps.
