# Design System Specification: High-End Editorial SaaS

## 1. Overview & Creative North Star: "The Architectural Curator"
This design system moves beyond the generic "SaaS dashboard" aesthetic to embrace an editorial, high-end digital experience. Our Creative North Star is **The Architectural Curator**. 

Instead of rigid grids and boxed-in components, we treat the UI as a series of intentional, layered planes. We achieve "Trustworthy" not through heavy borders, but through authoritative typography and sophisticated tonal depth. By utilizing **Inter** for utility and **Manrope** for expression, we create a rhythmic hierarchy that feels both reliable and bespoke. This system prioritizes breathing room (whitespace) as a functional element, not just a stylistic choice.

---

## 2. Colors & Surface Philosophy

### The "No-Line" Rule
Standard SaaS layouts rely on 1px borders to separate ideas. This system prohibits solid borders for sectioning. Boundaries are defined exclusively through background color shifts or subtle tonal transitions. Use `surface-container-low` for secondary sections sitting on a `surface` background.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. Importance is signaled by "lifting" or "recessing" elements through our container tiers:
- **Base Layer:** `surface` (#f7f9fb) – The primary canvas.
- **Recessed Layer:** `surface-container-low` (#f2f4f6) – For sidebars or secondary content areas.
- **Elevated Layer:** `surface-container-lowest` (#ffffff) – For primary cards and interactive modules.
- **Deep Layer:** `surface-dim` (#d8dadc) – Use sparingly for inactive or background-state elements.

### The "Glass & Gradient" Rule
To inject "soul" into the professional interface, use **Glassmorphism** for floating elements (e.g., Modals, Popovers). Use a semi-transparent `surface` color with a `backdrop-blur` of 12px–20px. 
**Signature Texture:** For primary CTAs and Hero backgrounds, apply a subtle linear gradient from `primary` (#0058be) to `primary_container` (#2170e4) at a 135° angle. This prevents the "flat" look and adds a premium sheen.

---

## 3. Typography: Editorial Authority

We use a dual-font strategy to balance character with legibility.

- **Display & Headlines (Manrope):** High-contrast, geometric, and bold. These are the "anchors" of the page. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments to convey institutional strength.
- **Body & Labels (Inter):** The workhorse. Inter provides exceptional readability at small scales. 
- **The Hierarchy Rule:** Never use more than three type sizes on a single functional component. Let the weight and the color (`on_surface` vs `on_surface_variant`) do the heavy lifting for hierarchy.

| Role | Font | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| Display-LG | Manrope | 3.5rem | 700 | -0.02em |
| Headline-MD | Manrope | 1.75rem | 600 | -0.01em |
| Title-MD | Inter | 1.125rem | 500 | Normal |
| Body-MD | Inter | 0.875rem | 400 | Normal |
| Label-SM | Inter | 0.6875rem | 600 | 0.05em (Uppercase) |

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Depth is achieved by stacking. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#f2f4f6) background creates a natural, soft lift without needing a drop shadow.

### Ambient Shadows
Shadows should feel like natural light, not digital artifacts. 
- **Value:** `0px 12px 32px -4px`
- **Color:** Use a tinted version of `on_surface` at 4%–6% opacity. Never use pure black or grey (#000) for shadows; it "muddies" the clean slate background.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., in high-contrast modes), use a **Ghost Border**. Use the `outline_variant` token at **15% opacity**. 100% opaque borders are strictly forbidden as they interrupt the flow of the architectural layers.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`). White text. `xl` roundedness (0.75rem).
- **Secondary:** `surface-container-highest` background with `on_surface` text. No border.
- **Tertiary:** No background. `primary` text. Use for low-emphasis actions.

### Cards & Lists
- **Rule:** Forbid the use of divider lines. 
- **Implementation:** Separate list items using `spacing.4` (1rem) of vertical whitespace. For complex lists, alternate background colors between `surface` and `surface-container-low` to create a "Zebra" effect without lines.
- **Roundedness:** Use `xl` (0.75rem) for main containers and `lg` (0.5rem) for nested elements.

### Input Fields
- **Base State:** `surface-container-lowest` background with a Ghost Border.
- **Focus State:** 2px solid `primary`. No "glow" (shadow) – let the sharp color transition signal the state change.
- **Error State:** Use `error` (#ba1a1a) for the text and `error_container` (#ffdad6) for a soft background tint.

### Architectural Breadcrumbs
Move beyond `Home > Category`. Use a vertical "Curator" style breadcrumb in the sidebar or a large-scale horizontal layout that uses `headline-sm` for the current page, making the navigation feel like a title.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical margins (e.g., a wider left gutter) to create an editorial feel.
- **Do** lean heavily on `surface-container` tiers to create hierarchy.
- **Do** use `letter-spacing: 0.05em` on `label-sm` to ensure readability in all-caps.
- **Do** allow elements to overlap slightly (e.g., a card bleeding into a header background) to break the "grid" feel.

### Don’t
- **Don’t** use pure black (#000000) for text. Use `on_surface` (#191c1e) to maintain a premium, navy-slate depth.
- **Don’t** use 1px solid borders for layout separation. Use tonal shifts.
- **Don’t** use default Tailwind shadows. Always use the Ambient Shadow formula (tinted, low-opacity, large-blur).
- **Don’t** crowd the interface. If you think it needs more "organization," add more whitespace (`spacing.12` or `spacing.16`) before adding a line or a box.