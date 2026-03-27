# SplitFlapNinja

A vintage, mechanical-style split-flap display built completely with static HTML, CSS, and Vanilla JavaScript. Optimized for 1024x600 resolution displays (such as the classic Acer Aspire One ZG5), featuring realistic 3D CSS animations, deep industrial frame aesthetics, and URL sharing capabilities.

## Features

- **Authentic Mechanical Animations:** Flaps cycle sequentially through the alphabet simulating real mechanical airport and train station displays.
- **Immersive Fullscreen Mode:** Perfectly stretches to the screen edges via CSS Container Queries, keeping a thick metallic-looking bezel and recessed shadow effects.
- **Custom Messages:** Input your own custom messages into a 5-row by 18-character grid.
- **URL Sharing:** Generate a shareable link that loads your custom board automatically (using the `?msg=` parameter).
- **Auto-Refresh:** The board periodically re-animates your message every 30 seconds to maintain an "alive" ambient aesthetic.
- **Zero Dependencies:** Pure Vanilla HTML, CSS, and JS. No build steps, no frameworks, zero bloat.

## Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lechu77/SplitFlapNinja.git
   ```
2. **Open the App:** Simply open `index.html` in your favorite web browser. No local server is strictly required.

## Deployment to Cloudflare Pages

This app was designed from the ground up to be a highly performant static application. Hosting it on **Cloudflare Pages** takes less than a minute:

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create application**, then switch to the **Pages** tab.
3. Select **Connect to Git** and authorize Cloudflare to access your GitHub repository (`lechu77/SplitFlapNinja`).
4. In the **Build settings** section:
   - **Framework preset:** `None`
   - **Build command:** *(leave blank)*
   - **Build output directory:** *(leave blank, or `/`)*
5. Click **Save and Deploy**. 

Your Split-Flap board will be live globally in seconds!

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE.md](LICENSE.md) file for details.
