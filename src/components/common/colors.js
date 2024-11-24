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
    const themeInfo = document.createElement("div");
    themeInfo.id = "theme-info-popup";
    themeInfo.textContent = `Theme set to: ${randomTheme.name}`;
    document.body.appendChild(themeInfo);
    setTimeout(() => {
        themeInfo.remove();
    }, 12000);
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
        name: "Nightfall Ember",
        color1: "15, 23, 42",        // Midnight Navy
        color2: "30, 41, 59",        // Deep Grayish Blue
        color3: "245, 158, 11",      // Amber
        color4: "239, 68, 68",       // Bright Red
        color5: "16, 185, 129",      // Emerald Green
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
        name: "Autumn Echo",
        color1: "49, 45, 45",        // Dark Coffee
        color2: "144, 103, 64",      // Rustic Brown
        color3: "255, 194, 61",      // Golden Yellow
        color4: "163, 106, 61",      // Earthy Tan
        color5: "249, 90, 52",       // Burnt Orange
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
        name: "Vibrant Aura",
        color1: "78, 108, 189",      // Steel Blue
        color2: "254, 197, 51",      // Lemon Yellow
        color3: "30, 73, 82",        // Deep Sea Blue
        color4: "188, 62, 129",      // Fuchsia
        color5: "16, 186, 149",      // Turquoise Green
    },
    {
        name: "Mystic Sands",
        color1: "142, 92, 50",       // Warm Beige
        color2: "82, 61, 45",        // Dark Walnut
        color3: "255, 228, 163",     // Soft Gold
        color4: "189, 131, 105",     // Clay
        color5: "255, 117, 62",      // Peach
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
        name: "Golden Pulse",
        color1: "192, 57, 43",       // Bold Red
        color2: "243, 156, 18",      // Sun Yellow
        color3: "43, 67, 87",        // Slate Blue
        color4: "121, 85, 72",       // Cocoa Brown
        color5: "243, 241, 226",     // Creamy White
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
        name: "Cherry Blossom",
        color1: "212, 120, 155",     // Soft Pink
        color2: "126, 118, 141",     // Mauve
        color3: "216, 190, 176",     // Light Peach
        color4: "36, 45, 49",        // Dark Charcoal
        color5: "225, 74, 39",       // Bright Cherry Red
    },
    {
        name: "Solar Flare",
        color1: "255, 103, 62",      // Bright Orange
        color2: "22, 20, 23",        // Charcoal Black
        color3: "253, 243, 48",      // Yellow Gold
        color4: "120, 74, 44",       // Bronze
        color5: "207, 124, 39",      // Amber Gold
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
        name: "Emerald Ridge",
        color1: "33, 83, 77",        // Forest Green
        color2: "121, 158, 145",     // Moss Green
        color3: "232, 241, 234",     // Light Mint
        color4: "44, 78, 61",        // Olive Green
        color5: "224, 159, 120",     // Soft Peach
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
        name: "Citrus Grove",
        color1: "191, 174, 15",      // Lemon Yellow
        color2: "233, 89, 53",       // Tangerine Orange
        color3: "106, 162, 57",      // Lime Green
        color4: "230, 47, 27",       // Blood Orange
        color5: "247, 228, 149",     // Pale Yellow
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
        name: "Verdant Oasis",
        color1: "46, 118, 55",       // Jungle Green
        color2: "45, 183, 141",      // Mint Green
        color3: "210, 251, 218",     // Light Mint
        color4: "89, 133, 111",      // Forest Green
        color5: "240, 186, 106",     // Golden Yellow
    },
    {
        name: "Firelight",
        color1: "240, 86, 37",       // Fiery Red
        color2: "234, 96, 60",       // Ember Orange
        color3: "191, 132, 67",      // Golden Amber
        color4: "34, 37, 49",        // Charcoal
        color5: "211, 154, 87",      // Honey Brown
    },
    {
        name: "Blushing Tides",
        color1: "251, 176, 180",     // Soft Pink
        color2: "209, 131, 173",     // Rose
        color3: "242, 222, 234",     // Light Lavender
        color4: "144, 125, 130",     // Dusty Rose
        color5: "28, 62, 66",        // Deep Teal
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
        name: "Rustic Charm",
        color1: "120, 53, 15", // Rich Brown
        color2: "180, 83, 9", // Burnt Orange
        color3: "243, 244, 246", // Off-White
        color4: "161, 98, 7", // Golden Brown
        color5: "234, 179, 8", // Mustard Yellow
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
        name: "Forest Mist",
        color1: "6, 78, 59", // Dark Green
        color2: "16, 185, 129", // Emerald
        color3: "209, 250, 229", // Mint Cream
        color4: "110, 231, 183", // Light Green
        color5: "52, 211, 153", // Jade
    },
    {
        name: "Desert Sunset",
        color1: "124, 45, 18", // Terracotta
        color2: "234, 88, 12", // Bright Orange
        color3: "254, 215, 170", // Peach
        color4: "251, 146, 60", // Light Orange
        color5: "249, 115, 22", // Dark Orange
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
        name: "Electric Lemonade",
        color1: "0, 0, 0", // Black
        color2: "255, 250, 205", // Lemon Chiffon
        color3: "135, 206, 250", // Light Sky Blue
        color4: "255, 20, 147", // Deep Pink
        color5: "173, 216, 230", // Light Blue
    },
    {
        name: "Ocean Breeze",
        color1: "70,130,180", // Steel Blue
        color2: "255,215,0", // Gold
        color3: "240,248,255", // Alice Blue
        color4: "30,144,255", // Dodger Blue
        color5: "255,105,180" // Hot Pink
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
