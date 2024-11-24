export const setRandomTheme = () => {
  // Pick a random theme from the themes array
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  // Get the root element (document's root <html>)
  const root = document.documentElement;

  // Loop through the theme properties to set CSS variables
  Object.keys(randomTheme).forEach(key => {
      if (key.startsWith("color")) {
          root.style.setProperty(`--${key}`, randomTheme[key]);
      }
  });

  // Theme Info Popup
  let themeInfo = document.getElementById("theme-info-popup");
  if (!themeInfo) {
      // Create the div only if it doesn't exist
      themeInfo = document.createElement("div");
      themeInfo.id = "theme-info-popup";
      document.body.appendChild(themeInfo);
      
  }

  // Update the content of the div
  themeInfo.textContent = `${randomTheme.name}`;
};

export const themes = [
    {
        name: "Shaded Stone",
        color1: "26, 32, 44",        // Dark Slate
        color2: "45, 55, 72",        // Mid-tone Gray
        color3: "237, 242, 247",     // Soft White
        color4: "203, 213, 224",     // Light Gray
        color5: "229, 62, 62",       // Crimson Red
    },
    {
        name: "Royal Twilight",
        color1: "73, 43, 124",       // Deep Purple
        color2: "237, 138, 10",      // Golden Yellow
        color3: "246, 217, 18",      // Bright Yellow
        color4: "55, 34, 90",        // Dark Purple
        color5: "78, 44, 0",         // Dark Brown
    },
    {
        name: "Dusky Horizon",
        color1: "42, 61, 81",        // Charcoal Blue
        color2: "60, 72, 92",        // Steel Blue
        color3: "236, 245, 253",     // Misty White
        color4: "191, 207, 223",     // Pale Gray
        color5: "239, 87, 34",       // Fiery Orange
    },
    {
        name: "Emerald Mist",
        color1: "12, 37, 37",        // Deep Teal
        color2: "23, 78, 58",        // Forest Green
        color3: "182, 225, 211",     // Light Seafoam
        color4: "0, 92, 83",         // Dark Teal
        color5: "193, 53, 132",      // Rich Magenta
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
        name: "Oceanic Depths",
        color1: "2, 62, 74",         // Deep Teal
        color2: "40, 150, 172",      // Seafoam Green
        color3: "0, 121, 149",       // Ocean Blue
        color4: "144, 204, 204",     // Light Teal
        color5: "10, 18, 23",        // Dark Navy
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
        name: "Lavender Whispers",
        color1: "117, 63, 162",      // Deep Lavender
        color2: "223, 206, 255",     // Light Lavender
        color3: "235, 163, 92",      // Golden Peach
        color4: "48, 25, 55",        // Dark Purple
        color5: "174, 71, 124",      // Rich Magenta
    },
    {
        name: "Shadow Blossom",
        color1: "52, 32, 43",        // Dark Plum
        color2: "128, 94, 116",      // Dusty Rose
        color3: "191, 165, 191",     // Soft Lavender
        color4: "43, 51, 63",        // Slate Gray
        color5: "255, 105, 88",      // Coral Peach
    },
    {
        name: "Autumn Spice",
        color1: "195, 101, 56",      // Spicy Orange
        color2: "70, 57, 48",        // Earthy Brown
        color3: "238, 203, 133",     // Golden Wheat
        color4: "134, 92, 54",       // Dark Brown
        color5: "228, 139, 91",      // Rusty Red
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