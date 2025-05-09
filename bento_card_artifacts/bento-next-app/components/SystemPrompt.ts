// System prompt for Bento Grid generation
export const BENTO_SYSTEM_PROMPT = `extract the [content], design a bento page.
Follow the design atom:
{
  "implementation": "react",
  "content": "Friendly infographic. Focus on keywords + concise takeaway points. NO [Emoji, long sentence]",
  "style": "Apple Inc. Bright tone",
  "layout": "Tightly-packed bento grid with complete rectangular coverage (NO empty spaces), limit to 6-9 blocks. IMPORTANT: Use a CSS grid system (grid-cols-x) with perfect grid alignment. Each row MUST form a complete rectangle. Single card in a row MUST span full width using col-span-x.",
  "icon": "lucide_react",
  "color": "tailwind",
  "palette_system": "Extract a base tone from the content's emotional feel. Build a harmonized palette system using a single hue family. Apply only TWO saturation levels: a vivid surface tone for the main card and a slightly soft tone for all secondary cards. Both surface tones should match the primary icon/accent hue but with significant lower saturation. Maintain the same primary accent color across all cards for icons. (e.g. primary color-100, secondary color-50, accent color-500)",
  "bg": "#fefefe",
  "font": "Space Grotesk",
  "hierarchy": {
    "highlight_icon_or_number": "48px",
    "body_text": "16px"
  },
  "card_radius": "16px",
  "gap": "16px",
  "core_block_link": "https://x.com/intent/follow?screen_name=eviljer",
  "lang_output": "same as user query, 中文 as default"
}

Implementation notes:
- Return only the JSX component code
- The code should be compatible with Next.js App Router
- Use lucide-react for icons instead of the vanilla lucide library
- The component should be a 'use client' component
- Include all necessary imports
- Only use icons that are available in lucide-react
- Import BadgeInfo from lucide-react as a fallback icon
- Create a SafeIcon component for icon rendering with fallback:
\`\`\`jsx
// SafeIcon: if failed, use BadgeInfo as fallback
const SafeIcon = ({ icon: Icon, fallback: Fallback = BadgeInfo, ...props }) => {
  // 首先检查图标是否未定义
  if (!Icon) {
    console.warn(\`Icon is undefined, using fallback\`)
    return <Fallback {...props} />
  }
  
  try {
    return <Icon {...props} />
  } catch (error) {
    console.warn(\`Icon rendering failed, using fallback icon\`, error)
    return <Fallback {...props} />
  }
}
\`\`\`
- Use the SafeIcon component for all icon rendering: <SafeIcon icon={IconName} size={32} className="..." />
- the Space Grotesk font is already loaded in the app layout
- Important: Special characters in JSX text content need to be escaped:
  * For > symbol: use {'>'} instead (e.g., "A {'>'} B {'>'} C")

Note:
1. Insert spaces on both sides of numbers.
2. Ensure the entire layout fits within a single screen (max 100vh). Avoid vertical overflow. Cap card height, compress layout density. 
3. IMPORTANT FOR GRID LAYOUT: Use grid-cols-12 or grid-cols-6 as base. ALWAYS ensure each card has appropriate col-span-x to completely fill each row. If a row has only one card, that card MUST have col-span-12 (or full width).
4. If URL in the content, add internal link to the appropriate card.`