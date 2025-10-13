# SessionsTab Component - Visual Design Guide

## 🎨 Component Layout Overview

```
┌──────────────────────────────────────────────────────────────┐
│  SessionsTab Component                                       │
│                                                              │
│  ┌───────────────────────┐  ┌────────────────────────────┐ │
│  │ 📹 Start New Session  │  │ 📅 Schedule Session        │ │
│  │    (Primary Button)   │  │   (Outline Button)         │ │
│  └───────────────────────┘  └────────────────────────────┘ │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Upcoming Sessions                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📹  UI/UX Design Workshop          🔴 Live             │ │
│  │     ─────────────────────────────────────────────       │ │
│  │     👤 Hosted by Dr. Sarah Johnson [Instructor]        │ │
│  │     📅 Today, 3:00 PM • Duration: 1h 30m              │ │
│  │     👥 18 / 24 participants confirmed                  │ │
│  │                                                          │ │
│  │     [📹 Join Session]                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Recent Sessions                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📹  React Hooks Deep Dive          [Completed]         │ │
│  │     ─────────────────────────────────────────────       │ │
│  │     👤 Hosted by Dr. Sarah Johnson [Instructor]        │ │
│  │     📅 Oct 10, 2024 • Duration: 1h 30m                │ │
│  │     👥 18 attendees                                     │ │
│  │     📈 Avg Focus Score: 87% (Green)                    │ │
│  │     ─────────────────────────────────────────────       │ │
│  │     Lecture Summary                              [▼]    │ │
│  │     Covered useState, useEffect, useContext...         │ │
│  │                                                          │ │
│  │     [▶️ View Recording] [📄 View Notes] [📊 Analytics] │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Layouts

### Desktop View (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│  [📹 Start New Session]    [📅 Schedule Session]       │
│                                                         │
│  Upcoming Sessions                                      │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Session Card (Full Width)                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Recent Sessions                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Session Card (Full Width)                       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Tablet View (640px - 1024px)
```
┌──────────────────────────────────────────┐
│  [📹 Start]    [📅 Schedule]            │
│                                          │
│  Upcoming Sessions                       │
│  ┌────────────────────────────────────┐ │
│  │  Session Card                       │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### Mobile View (<640px)
```
┌────────────────────────────┐
│  [📹 Start New Session]   │
│  [📅 Schedule Session]    │
│                            │
│  Upcoming                  │
│  ┌──────────────────────┐ │
│  │  Session Card         │ │
│  │  (Compact)            │ │
│  └──────────────────────┘ │
└────────────────────────────┘
```

---

## 🎨 Color Palette Usage

### Live Session Badge
```
┌──────────────┐
│ 🔴 Live      │  bg-destructive (Red)
└──────────────┘  text-white
                  Pulse animation on dot
```

### Completed Badge
```
┌──────────────┐
│ Completed    │  bg-secondary/10 (Light Purple)
└──────────────┘  text-secondary (Purple)
```

### Role Badge
```
┌──────────────┐
│ Instructor   │  bg-secondary/10 (Light Purple)
└──────────────┘  text-secondary (Purple)
                  text-xs font-medium
```

### Focus Score Colors

```
87% ────────── text-success (Green)     [Excellent: 80-100]
75% ────────── text-info (Blue)         [Good: 60-79]
55% ────────── text-accent (Amber)      [Needs Improvement: <60]
```

---

## 🎯 Interactive States

### Button States

#### Primary Button (Start Session)
```
Default:   bg-primary/90 text-white
Hover:     bg-primary/90 (slight opacity change)
Focus:     Ring with focus-visible:ring-1
Disabled:  opacity-50 pointer-events-none
```

#### Outline Button (Schedule)
```
Default:   border-primary text-primary
Hover:     bg-secondary/15
Focus:     Ring with focus-visible:ring-1
```

### Card States
```
Default:   shadow-sm
Hover:     shadow-md (smooth transition)
```

---

## 📐 Spacing & Layout

### Container
```css
Padding:    p-4 (mobile) → p-6 (tablet+)
Height:     h-full
Overflow:   overflow-y-auto
```

### Session Cards
```css
Padding:      p-4 (mobile) → p-6 (tablet+)
Margin:       mb-4 (between cards)
Border:       border border-light-border
Radius:       rounded-lg
Background:   bg-background
```

### Section Headers
```css
Font:         text-xl font-semibold
Color:        text-heading
Margin:       mb-4 (below header)
              mt-8 (for Recent Sessions)
```

---

## 🔤 Typography Hierarchy

```
┌─────────────────────────────────────────┐
│  Section Heading                        │  text-xl font-semibold
│  ─────────────────────────────────      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Session Title                   │   │  text-lg font-semibold
│  │                                  │   │
│  │  Host Name                       │   │  text-sm (regular)
│  │  Date & Time                     │   │  text-sm text-para-muted
│  │  Participants                    │   │  text-sm text-para-muted
│  │  Focus Score                     │   │  text-sm (colored)
│  │                                  │   │
│  │  Lecture Summary                 │   │  text-sm font-medium (header)
│  │  Summary text content...         │   │  text-sm text-para-muted
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🎬 Animations & Transitions

### Live Badge Pulse
```css
Dot:  w-2 h-2 bg-white rounded-full animate-pulse
```

### Card Hover
```css
transition-shadow
shadow-sm → shadow-md (on hover)
```

### Summary Expand/Collapse
```css
Chevron Icon: Rotates between ChevronDown ↔ ChevronUp
Text:         line-clamp-3 (collapsed) → full text (expanded)
```

---

## 📏 Icon Sizes

```
Large Icons (Session Icon):      w-6 h-6
Small Icons (Details):           w-4 h-4
Avatar Small:                    w-6 h-6 (size="sm")
Icon Container:                  w-12 h-12
Empty State Icons:               w-12 h-12
```

---

## 🎭 Empty States

### No Upcoming Sessions
```
┌────────────────────────────────┐
│                                │
│         📅 (Calendar)          │  w-12 h-12 text-para-muted
│                                │
│   No Upcoming Sessions         │  text-lg font-semibold
│   Schedule a session to        │  text-sm text-para-muted
│   get started                  │
│                                │
└────────────────────────────────┘
```

### No Past Sessions
```
┌────────────────────────────────┐
│                                │
│         📹 (Video)             │  w-12 h-12 text-para-muted
│                                │
│   No Past Sessions             │  text-lg font-semibold
│   Completed sessions will      │  text-sm text-para-muted
│   appear here                  │
│                                │
└────────────────────────────────┘
```

---

## 🎨 Session Card Variants

### Upcoming Session Card
```
┌──────────────────────────────────────────────┐
│  [🟣]  Session Title               [Badge]  │
│   ↑                                    ↑      │
│   Primary                           Status    │
│   bg-primary/10                     Badge     │
│                                               │
│  👤 Host • [Role Badge]                      │
│  📅 Date & Time • Duration                   │
│  👥 Participants confirmed                    │
│                                               │
│  [⏰ Set Reminder]  [View Details]           │
└──────────────────────────────────────────────┘
```

### Live Session Card
```
┌──────────────────────────────────────────────┐
│  [🟣]  Session Title           🔴 Live      │
│                                 ↑             │
│                          Animated Pulse       │
│                                               │
│  👤 Host • [Role Badge]                      │
│  📅 Today, 3:00 PM • Duration: 2h            │
│  👥 20 / 20 participants confirmed           │
│                                               │
│  [📹 Join Session] ← Primary CTA             │
└──────────────────────────────────────────────┘
```

### Past Session Card
```
┌──────────────────────────────────────────────┐
│  [⚪]  Session Title          [Completed]   │
│   ↑                                           │
│   Muted                                       │
│   bg-secondary/10                             │
│                                               │
│  👤 Host • [Role Badge]                      │
│  📅 Oct 10, 2024 • Duration: 1h 30m         │
│  👥 18 attendees                             │
│  📈 Avg Focus Score: 87%                     │
│  ─────────────────────────────────────────   │
│  Lecture Summary                      [▼]    │
│  Summary text (expandable)...                │
│                                               │
│  [▶️ Recording] [📄 Notes] [📊 Analytics]   │
└──────────────────────────────────────────────┘
```

---

## 🎯 Action Button Layouts

### Upcoming Session Actions
```
┌────────────────────────────────────────┐
│  [⏰ Set Reminder] [View Details]     │
│   ↑ Outline       ↑ Outline           │
│   variant         variant             │
└────────────────────────────────────────┘
```

### Live Session Actions
```
┌────────────────────────────────────────┐
│        [📹 Join Session]               │
│         ↑ Primary CTA                  │
│         Full width on mobile           │
└────────────────────────────────────────┘
```

### Past Session Actions
```
┌──────────────────────────────────────────────────────────┐
│  [▶️ View Recording] [📄 View Notes] [📊 View Analytics] │
│   ↑ All outline variant, size sm                         │
│   Wrap on mobile (flex-wrap)                             │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Data Display Patterns

### Host Information
```
┌─────────────────────────────────────┐
│  👤  Hosted by Dr. Sarah Johnson   │  Avatar + Text
│      [Instructor]                   │  Role Badge
│       ↑                             │
│   bg-secondary/10                   │
│   text-secondary                    │
└─────────────────────────────────────┘
```

### Date & Time
```
┌─────────────────────────────────────────────┐
│  📅  Today, 3:00 PM • Duration: 1h 30m     │
│      ↑                  ↑                   │
│   Smart format      Duration separator     │
└─────────────────────────────────────────────┘
```

### Participants
```
┌─────────────────────────────────────────────┐
│  👥  18 / 24 participants confirmed        │  Upcoming
│  👥  18 attendees                          │  Past
└─────────────────────────────────────────────┘
```

### Focus Score
```
┌─────────────────────────────────────────────┐
│  📈  Avg Focus Score: 87%                  │
│       ↑                ↑                    │
│   TrendingUp        Color-coded            │
│   Icon              (Green/Blue/Amber)     │
└─────────────────────────────────────────────┘
```

---

## 🔍 Accessibility Features

### Semantic HTML Structure
```html
<article>           <!-- Session Card -->
  <h3>              <!-- Session Title -->
  <section>         <!-- Details Section -->
  <button>          <!-- Action Buttons -->
</article>
```

### ARIA Attributes
```html
<button aria-expanded="true">
  Lecture Summary
  <ChevronUp />
</button>
```

### Focus States
```
All interactive elements have:
- focus-visible:outline-none
- focus-visible:ring-1
- focus-visible:ring-ring
```

---

## 🎨 Light vs Dark Mode

### Light Mode
```
Background:      #fafafa (soft white)
Card:            #ffffff (pure white)
Border:          #e5e7eb (light gray)
Primary:         #2f1a58 (deep purple)
Text:            #111827 (dark gray)
```

### Dark Mode
```
Background:      #160f25 (dark purple)
Card:            #1f2937 (dark gray)
Border:          #363e4e (medium gray)
Primary:         #8a4ecf (light purple)
Text:            #ffffff (white)
```

All color classes automatically adapt via CSS variables!

---

## 🎬 User Flow Examples

### Starting a New Session
```
1. User clicks "Start New Session"
2. Modal/Page opens with session configuration
3. User sets title, duration, options
4. Session starts immediately
5. Appears in "Upcoming" with "Live" badge
```

### Joining a Live Session
```
1. User sees session with "🔴 Live" badge
2. Clicks "Join Session" button
3. Redirects to live session room
4. Video/audio interface loads
```

### Viewing Past Session
```
1. User scrolls to "Recent Sessions"
2. Expands "Lecture Summary" by clicking chevron
3. Clicks "View Recording" to watch
4. Clicks "View Notes" for summary
5. Clicks "View Analytics" for metrics
```

---

## 📱 Mobile Optimizations

### Touch Targets
- All buttons: Minimum 44px height
- Adequate spacing between interactive elements
- Tap-friendly card area

### Responsive Text
```
Headings:   text-lg → text-xl (mobile → desktop)
Body:       text-xs → text-sm (mobile → desktop)
```

### Stacked Layout
```
Mobile:     All elements stack vertically
Tablet+:    Side-by-side where appropriate
```

---

## 🎉 Summary

The SessionsTab component provides a **comprehensive, accessible, and beautiful** interface for managing virtual classroom sessions. With:

✅ **Clean Design** - Follows design system perfectly  
✅ **Responsive** - Works on all screen sizes  
✅ **Accessible** - ARIA labels, semantic HTML, keyboard nav  
✅ **Performant** - Efficient rendering and state management  
✅ **Maintainable** - Well-structured, documented code  
✅ **Production-Ready** - No errors, TypeScript strict mode  

**Component is ready for immediate use!** 🚀
