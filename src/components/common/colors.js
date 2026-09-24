// Some themes have a pale accent (ice, gold) or a near-white color4, which
// the newer sections can't use as-is for text or surfaces. Derive three safe
// colours from every theme instead:
//   --surface      a dark card background tinted with the theme's color1
//   --accent-text  color2, lightened until it reads on --surface (4.5:1)
//   --on-accent    black or white, whichever reads on a color2 fill
const rgb = (s) => s.split(',').map((v) => Number(v.trim()));
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const luminance = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

const applyDerivedColors = (theme) => {
  const root = document.documentElement;
  const accent = rgb(theme.color2);
  let surface = rgb(theme.color1);
  for (let i = 0; i < 20 && luminance(surface) > 0.02; i++) surface = mix(surface, [6, 10, 14], 0.25);
  let accentText = accent;
  for (let i = 0; i < 20 && contrast(accentText, surface) < 4.5; i++) accentText = mix(accentText, [255, 255, 255], 0.15);
  const onAccent = contrast(accent, [255, 255, 255]) >= 3 ? '255, 255, 255' : '14, 20, 26';
  root.style.setProperty('--surface', surface.join(', '));
  root.style.setProperty('--accent-text', accentText.join(', '));
  root.style.setProperty('--on-accent', onAccent);
};

export const setRandomTheme = () => {
  const themeLoaded = localStorage.getItem('themeLoaded') === 'true';
  let randomTheme = {};

  if(themeLoaded) {
    // Pick a random theme from the themes array
    randomTheme = themes[Math.floor(Math.random() * themes.length)];
  } else {
    // Always load Coral Reef theme at first
    randomTheme = themes.find(theme => theme.name === "Coral Reef");
    localStorage.setItem('themeLoaded', 'true');
  }

  // Get the root element (document's root <html>)
  const root = document.documentElement;

  // Loop through the theme properties to set CSS variables
  Object.keys(randomTheme).forEach(key => {
      if (key.startsWith("color")) {
          root.style.setProperty(`--${key}`, randomTheme[key]);
      }
  });

  applyDerivedColors(randomTheme);

  // Theme Info Popup
  let themeInfoName = document.getElementById("theme-info-popup-name");

  // Update the content of the div
  themeInfoName.textContent = `${randomTheme.name}`;
  return randomTheme.name;
};

export const themes = [
    {
        name: "Royal Twilight",
        color1: "73, 43, 124",       // Deep Purple
        color2: "237, 138, 10",      // Golden Yellow
        color3: "246, 217, 18",      // Bright Yellow
        color4: "55, 34, 90",        // Dark Purple
        color5: "78, 44, 0",         // Dark Brown
    },
    {
        name: "Electric Bliss",
        color1: "51, 59, 88",        // Dark Blue-Gray
        color2: "242, 35, 35",       // Bright Red
        color3: "84, 219, 255",      // Cyan
        color4: "8, 8, 8",           // Black
        color5: "255, 205, 105",     // Soft Yellow
    },
    {
        name: "Lunar Cascade",
        color1: "38, 50, 63",        // Midnight Blue
        color2: "133, 147, 158",     // Ash Gray
        color3: "186, 228, 253",     // Light Blue
        color4: "27, 38, 48",        // Dark Navy
        color5: "241, 198, 77",      // Mustard Yellow
    },
    {
        name: "Frozen Peaks",
        color1: "45, 60, 82",        // Cool Blue
        color2: "200, 230, 252",     // Pale Ice
        color3: "240, 126, 65",      // Coral
        color4: "112, 145, 172",     // Soft Steel Blue
        color5: "16, 41, 63",        // Deep Midnight Blue
    },
    {
        name: "Frosted Moon",
        color1: "18, 36, 50",        // Midnight Blue
        color2: "234, 243, 247",     // Frost White
        color3: "115, 154, 171",     // Ocean Blue
        color4: "94, 122, 144",      // Sky Blue
        color5: "25, 92, 115",       // Teal
    },
    {
        name: "Ebon Glow",
        color1: "38, 33, 33",        // Ebony Black
        color2: "136, 130, 130",     // Warm Taupe
        color3: "213, 140, 191",     // Soft Pink
        color4: "238, 197, 138",     // Honey Yellow
        color5: "76, 116, 124",      // Charcoal Blue
    },
    {
        name: "Onyx Ember",
        color1: "25, 29, 38",        // Onyx Black
        color2: "162, 128, 119",     // Sandy Brown
        color3: "255, 119, 55",      // Golden Orange
        color4: "64, 82, 107",       // Steel Gray
        color5: "222, 95, 72",       // Coral Red
    },
    {
        name: "Arctic Aurora",
        color1: "18, 39, 55", // Deep Navy
        color2: "103, 232, 249", // Bright Cyan
        color3: "199, 210, 254", // Pale Lavender
        color4: "56, 189, 248", // Sky Blue
        color5: "239, 246, 255", // Ice White
    },
    {
        name: "Twilight Zen",
        color1: "30, 58, 138", // Royal Blue
        color2: "79, 70, 229", // Indigo
        color3: "236, 254, 255", // Pale Cyan
        color4: "165, 180, 252", // Periwinkle
        color5: "217, 70, 239", // Bright Purple
    },
    {
        name: "Coral Reef",
        color1: "7, 59, 76", // Deep Ocean Blue
        color2: "255, 127, 80", // Coral Orange
        color3: "176, 224, 230", // Pale Aqua
        color4: "64, 164, 175", // Teal
        color5: "250, 235, 215", // Soft Peach
    },
    {
        name: "Mountain Mist",
        color1: "38, 50, 56", // Charcoal Gray
        color2: "120, 144, 156", // Stone Gray
        color3: "224, 242, 241", // Pale Mint
        color4: "84, 110, 122", // Slate Gray
        color5: "255, 193, 7", // Amber
    },
    {
        name: "Midnight Gold",
        color1: "0, 0, 0", // Black
        color2: "255, 215, 0", // Gold
        color3: "255, 255, 255", // White
        color4: "128, 128, 128", // Gray
        color5: "255, 165, 0", // Orange
    },
    {
        name: "Sunset Sky",
        color1: "25, 25, 112", // Midnight Blue
        color2: "255, 204, 0", // Bright Yellow
        color3: "255, 127, 80", // Coral
        color4: "240, 248, 255", // Alice Blue
        color5: "255, 69, 0", // Red-Orange
    },
    {
        name: "Violet Dusk",
        color1: "75, 0, 130", // Indigo
        color2: "255, 215, 0", // Gold
        color3: "238, 130, 238", // Violet
        color4: "240, 248, 255", // Alice Blue
        color5: "128, 0, 128", // Purple
    },
    {
        name: "Blackberry Lemonade",
        color1: "39,8 ,32", // Dark Green 
        color2: "255 ,215 ,0", // Gold 
        color3: "153 ,50 ,204", // Dark Orchid 
        color4: "240 ,248 ,255", // Alice Blue 
        color5: "255 ,20 ,147", // Deep Pink 
    },
    {
        name: "Golden Twilight",
        color1: "25 ,25 ,112", // Midnight Blue 
        color2: "255 ,215 ,0", // Gold 
        color3: "240 ,248 ,255", // Alice Blue 
        color4: "75 ,0 ,130", // Indigo 
        color5: "238 ,130 ,238", // Violet 
    },
    {
        name: "Starry Night",
        color1: "0 ,0 ,0", // Black 
        color2: "255 ,215 ,0", // Gold 
        color3: "30 ,144 ,255", // Dodger Blue 
        color4: "240 ,248 ,255", // Alice Blue 
        color5: "238 ,130 ,238", // Violet 
    }
];
