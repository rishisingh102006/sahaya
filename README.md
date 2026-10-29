# Sahaya — Senior Citizen & NGO Welfare Portal

> **A centralized digital community portal ensuring dignified, reliable, and prompt welfare assistance for senior citizens in collaboration with verified NGOs and volunteer networks.**
> Built with **liquidGL (Liquid Glass Library v3.0.0)**, React, TypeScript, and Supabase.

---

## Overview

Sahaya bridges the gap between elderly citizens who require physical, medical, or administrative support and the NGOs and community volunteers equipped to help. 

The entire portal features a modern **Liquid Glass** aesthetic powered by `liquid-gl` — providing realistic glass refraction, subtle bevels, glossy specular highlights, frosted panels, and interactive lenses while maintaining strict accessibility and senior-friendly readability.

---

## Key Modules & Features

### 1. Senior Beneficiary Portal
- **One-Click Assistance Intake**: 3-step wizard to request medical appointment escorts, scheduled transportation, heavy grocery delivery, or digital life certificate (Jeevan Pramaan) documentation.
- **Senior Accessibility First**: One-click font scaler (`A`, `A+`, `A++`), high-contrast typography, large touch targets, and distraction-free layouts.
- **SOS Emergency Beacon**: Immediate access to verified 24/7 helplines (Elderline `14567`, Medical Emergency `108`, Unified `112`) and instant rapid-dispatch assistance.

### 2. Live Request Tracking
- **Cryptographic Track ID Search**: Beneficiaries and families can track real-time progression from intake (`pending`) to NGO triage (`assigned`), field pickup (`in_progress`), and safe fulfillment (`completed`).
- **Interactive Stepper**: 4-checkpoint visual lifecycle tracker with volunteer contact chips and doorstep delivery verification.

### 3. Welfare Scheme & Pension Navigator
- **22+ Central & State Schemes**: Match Ayushman Bharat (Vaya Vandana Yojana for 70+), Indira Gandhi National Old Age Pension (IGNOAPS), Rashtriya Vayoshri Yojana, and NGO assistive aids.
- **Dynamic Eligibility Evaluation**: Real-time evaluation engine scoring age, state, gender, and income criteria.
- **Doorstep Application Assistance**: Seniors can request a physical volunteer to visit their home with biometric verification and form assistance.

### 4. NGO Command & Coordination Dashboard
- **Triage Center**: Queue management with live priority badges, status filters, and one-click volunteer assignment modals.
- **Real-Time Analytics & Distribution Charts**: Liquid Glass interactive lenses showing category breakdowns, lifecycle donuts, and 7-day throughput velocity.
- **Official Operations Audit Export**: Client-side cryptographic PDF and CSV report generation via `jsPDF`.

### 5. Field Volunteer Portal
- **On-Duty Availability Toggle**: Real-time status toggle for field dispatch.
- **Active Assignment Stack**: Turn-by-turn senior directions, call triggers, and delivery note logs.
- **Open Requests Feed**: Live feed of unassigned assistance requests sorted by proximity and urgency.

### 6. Senior Citizen Reviews & Trust
- **Verified Service Reviews**: Star ratings with micro-animations and testimonials ensuring transparency and dignity.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling & Glass Effects**: `liquid-gl@3.0.0` (WebGPU/WebGL with automatic CSS fallback), Tailwind CSS, Vanilla CSS design tokens
- **Icons**: Lucide React
- **Reporting**: `jsPDF` for client-side PDF document generation
- **Backend & Persistence**: Node.js, Express, Supabase (PostgreSQL with Row Level Security)

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/rishisingh102006/sahaya.git
cd sahaya
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your Supabase project credentials are set:
```env
VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Production Build

To build the optimized production bundle:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

---

## License & Welfare Mission

Developed for social welfare, non-profit elder care networks, and academic evaluation.
All assistance services are 100% free of commercial fees for senior citizens.
