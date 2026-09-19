# LedgerCare Frontend

> Modern, standalone React + Vite single-page application for **LedgerCare** — A Blockchain-Based Transparent Charity Management System.

LedgerCare provides complete transparency for charitable donations without forcing donors into the complexities of cryptocurrency or Web3 wallets. Donors donate in **Indian Rupees (₹)** via UPI or Cards, while the backend relayer securely commits every campaign, donation, fund utilization, and evidence hash to the Solidity smart contracts on the Ethereum/Hardhat blockchain.

---

## 🌟 Core Architecture & Principles

1. **Strictly Indian Rupees (₹) for Donors**:
   - Preset amounts: ₹100, ₹500, ₹1,000, ₹2,000, or custom amounts.
   - Standard payment checkout simulation (UPI: Google Pay, PhonePe, Paytm, or Credit/Debit Cards).
   - Zero cryptocurrency jargon, gas fees, or ETH amounts visible to donors.

2. **Zero Client-Side Blockchain Dependencies**:
   - Built entirely in **React 18 + Vite + JavaScript**.
   - No `ethers`, `web3.js`, `viem`, `wagmi`, or MetaMask SDK in the frontend.
   - Donors and charities do NOT require browser extensions, seed phrases, or crypto wallets.

3. **Backend Relayer Communication**:
   - Communicates exclusively with `LedgerCareBackend` via REST API at `http://localhost:5000/api`.
   - The backend relayer handles on-chain transaction signing, gas management, and IPFS pinning.

4. **Cryptographic Hash-Based Verification**:
   - Charities are verified deterministically by validating legal registration credentials against on-chain records.
   - Campaign creation is guarded: only verified charities can launch campaigns.
   - Expenditures require proof documents (receipts, bills, photos) pinned to IPFS.
   - Document integrity is verifiable via a two-stage cryptographic hash validator (**MATCH ✓** / **NO MATCH ✕**).
   - **Admin has zero manual approve/reject buttons**: The admin portal is purely for auditing and monitoring cryptographic state.

---

## 🏗️ System Overview

```
+-------------------------------------------------------------+
|                     DONOR & PUBLIC UI                       |
|           LedgerCare Frontend (React 18 + Vite)             |
|   - INR (₹) Donations via UPI / Card                        |
|   - Campaign Explorer & Progress Tracking                   |
|   - 80G Tax Receipts & Verification                         |
|   - Two-Stage Hash Validator (IPFS vs On-Chain)             |
|   - Read-Only Blockchain Explorer & Audit Timeline          |
+-------------------------------------------------------------+
                               |
                        HTTP / REST API
                               v
+-------------------------------------------------------------+
|                    LEDGERCARE BACKEND                       |
|               Node.js + Express (Port 5000)                 |
|   - Relayer Signer (Automates on-chain transactions)        |
|   - Payment Gateway Verification (Razorpay / UPI)           |
|   - Keccak-256 / SHA-256 Hash Normalization                 |
|   - IPFS Pinning Service (Pinata / IPFS Node)               |
+-------------------------------------------------------------+
                               |
                    JSON-RPC / Private Key
                               v
+-------------------------------------------------------------+
|                   HARDHAT BLOCKCHAIN NODE                   |
|                   Chain ID: 31337 (Localhost)               |
|                                                             |
|   1. CharityRegistry.sol       (0x5FbDB...aa3)              |
|   2. CampaignManager.sol       (0xe7f17...512)              |
|   3. DonationLedger.sol        (0x9fE46...6e0)              |
|   4. FundEvidenceTracker.sol   (0xDc64a...6C9)              |
+-------------------------------------------------------------+
```

---

## 📁 Project Structure

```
LedgerCareFrontend/
├── .env                                  # Environment variables (VITE_API_URL)
├── .env.example                          # Example template
├── index.html                            # Application entry HTML
├── package.json                          # Clean dependencies (React, Vite, Lucide, Router)
├── vite.config.js                        # Vite bundler configuration
├── dist/                                 # Production build output
└── src/
    ├── App.jsx                           # Application router & error boundary
    ├── main.jsx                          # React DOM entry point
    ├── index.css                         # Dark design system & typography
    ├── components/
    │   ├── Navbar.jsx                    # Header navigation + instant role switcher
    │   ├── Footer.jsx                    # Footer with smart contract addresses
    │   ├── CampaignCard.jsx              # Campaign card with INR target, raised, badges
    │   ├── CampaignProgress.jsx          # Visual progress bar with % and INR amounts
    │   ├── StatusBadge.jsx               # Universal badges (Charity, Campaign, Evidence)
    │   ├── DonationModal.jsx             # Pure ₹ donation flow (UPI / Card simulation)
    │   ├── AuditTimeline.jsx             # Chronological immutable event list
    │   └── LoadingSpinner.jsx            # Animated loading component
    ├── context/
    │   └── AuthContext.jsx               # Role-based context (Donor, Charity, Admin)
    ├── services/
    │   └── api.js                        # Centralized REST client with fallback mock
    ├── utils/
    │   └── formatters.js                 # Indian Rupee (₹), date, and hash formatting
    └── pages/
        ├── Home.jsx                      # Landing page, stats, featured campaigns
        ├── Campaigns.jsx                 # Campaign directory with search & category filters
        ├── CampaignDetails.jsx           # Campaign story, funds, evidence, recent donations
        ├── CharitiesList.jsx             # Directory of registered & verified charities
        ├── CharityRegister.jsx           # Charity onboarding (registration ID, legal info)
        ├── CharityVerification.jsx       # Real-time verification status check
        ├── CreateCampaign.jsx            # Campaign creation (guarded by verification status)
        ├── CharityCampaigns.jsx          # Charity-managed campaigns dashboard
        ├── CharityDashboard.jsx          # Overview of charity operations, metrics & funds
        ├── CharityEvidenceUpload.jsx     # Invoice/receipt upload with SHA-256 generation
        ├── FundUtilization.jsx           # Milestone and expenditure allocations
        ├── DonationSuccess.jsx           # Donation confirmation with tx hash & receipt link
        ├── DonationHistory.jsx           # Donor's past donations & tax records
        ├── DonationReceipt.jsx           # Printable 80G tax receipt
        ├── EvidenceVerification.jsx      # Two-stage cryptographic hash validator
        ├── TransparencyTimeline.jsx      # Campaign audit timeline
        ├── BlockchainRecords.jsx         # Read-only explorer of on-chain activity
        ├── AdminDashboard.jsx            # Auditor view (strict monitoring; no manual buttons)
        ├── AdminCharityMonitoring.jsx    # Table of registered charities and their hashes
        ├── AdminEvidenceMonitoring.jsx   # Table of evidence uploads and verification states
        ├── DonorDashboard.jsx            # Donor profile, total given ₹, active causes
        ├── About.jsx                     # Educational explainer on cryptographic charity
        ├── Login.jsx                     # Role selection and login
        └── NotFound.jsx                  # 404 page
```

---

## 📦 Installed Packages

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | `^18.3.1` | UI library |
| `react-dom` | `^18.3.1` | React DOM renderer |
| `react-router-dom` | `^6.26.0` | Client-side routing and navigation |
| `lucide-react` | `^0.441.0` | Lightweight, modern icon set |
| `@vitejs/plugin-react` | `^4.3.1` | Vite plugin for React (dev) |
| `vite` | `^5.4.2` | Lightning-fast development server & bundler (dev) |

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create or verify `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔗 Connected REST API Endpoints

All network requests go through `src/services/api.js`:

- **System**:
  - `GET /health` – Backend status, blockchain connection, relayer address.
  - `GET /stats` – Platform metrics (₹ total raised, verified charities, active campaigns).
- **Campaigns**:
  - `GET /campaigns` – List all campaigns.
  - `GET /campaigns/:id` – Detailed campaign info with fund utilization and evidence.
  - `POST /campaigns` – Create a new campaign (guarded: verified charities only).
  - `GET /campaigns/:id/donations` – On-chain confirmed donations.
  - `GET /campaigns/:id/usages` – Fund allocation breakdown.
- **Charities**:
  - `GET /charities` – Registered charities directory.
  - `GET /charities/:id` – Individual charity profile.
  - `POST /charities/register` – Submit legal registration info (generates hash and records on-chain).
  - `GET /charities/verification/:regNumber` – Lookup cryptographic verification status.
- **Payments & Donations (₹ INR)**:
  - `POST /payments/create-order` – Create INR order for Razorpay / UPI gateway.
  - `POST /payments/verify` – Verify payment signature and trigger on-chain settlement.
  - `GET /donations` – Fetch donations list.
  - `GET /donations/:id` – Individual donation record for receipt generation.
- **Evidence & Utilization**:
  - `POST /evidence/upload` – Upload bill/photo, pin to IPFS, record hash on-chain.
  - `GET /evidence/:id` – Retrieve evidence details.
  - `POST /evidence/verify` – Verify uploaded file against on-chain hash.
  - `POST /funds/allocate` – Record milestone expenditure.
- **Transparency**:
  - `GET /transparency/timeline/:campaignId` – Chronological lifecycle audit trail.
  - `GET /transparency/blockchain` – Verified on-chain transaction records.

---

## 📄 License
MIT

