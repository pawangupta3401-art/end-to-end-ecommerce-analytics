# 🛒 Olist End-to-End E-Commerce & Marketing Funnel Analytics

<div align="center">

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://olist-ecommerce-analytics-kappa.vercel.app)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Power BI](https://img.shields.io/badge/BI-Power%20BI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Chart.js](https://img.shields.io/badge/Visuals-Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

An enterprise-grade analytics project covering the full data lifecycle from **raw data ingestion** and **star schema modeling** to **advanced SQL querying**, **Power BI reports**, and an **interactive web analytics dashboard**.

**[🌐 View Live Dashboard](https://olist-ecommerce-analytics-kappa.vercel.app)** | **[📊 Power BI Report Link](08_power_bi_dashboard/olist_dashboard_link.md)** | **[🔍 SQL Analytical Insights](07_Analytical_insights/)**

</div>

---

## 📌 Executive Overview

This project analyzes the real-world **Olist Brazilian E-Commerce Dataset** (~100,000 orders) and the **Olist Marketing Funnel Dataset** (8,000 MQLs) across 2016–2018.

### Key Business Questions Solved:
- **E-Commerce Performance:** What is the total GMV, order volume, and monthly revenue growth trend?
- **Customer Behavior:** Where are customers concentrated, what is the repeat purchase rate, and who are the top CLV drivers?
- **Logistics & SLAs:** Which Brazilian states face delivery bottlenecks, and how does shipping delay affect customer ratings?
- **Category Profitability:** Which product categories generate top revenue vs. highest freight burden?
- **Marketing Funnel:** What is the conversion efficiency from MQL to closed seller deal, and which lead sources bring higher-revenue sellers?

---

## 🚀 Live Interactive Web Dashboard

In addition to PostgreSQL and Power BI, this repository includes an interactive, client-ready web dashboard with responsive dark-mode aesthetics.

| Metric | Value | Description |
|---|---|---|
| **Total Orders** | `99,441` | Total marketplace orders analyzed |
| **Gross Revenue (GMV)** | `R$ 13.59M` | Product item sales across 2017–2018 |
| **Unique Customers** | `96,096` | Spread across all 27 Brazilian states |
| **Repeat Purchase Rate** | `3.02%` | High acquisition, loyalty opportunity |
| **Average Delivery Time** | `12.5 days` | Purchase timestamp to customer receipt |
| **MQL to Closed Deal Rate**| `10.53%` | 842 closed sellers from 8,000 qualified leads |

👉 **Live URL:** [https://olist-ecommerce-analytics-kappa.vercel.app](https://olist-ecommerce-analytics-kappa.vercel.app)

---

## 🏗️ Analytics Architecture & Project Structure

```bash
end-to-end-ecommerce-analytics/
├── 01_project_overview/            # Business context & problem formulation
├── 02_data_sources/                # Kaggle dataset lineage & schema scope
├── 03_ddl_table_creation/          # PostgreSQL DDL table schemas (ecommerce + marketing)
├── 04_dml_data_load/               # COPY commands & ETL ingestion scripts
├── 05_data_validation/             # Data quality checks, constraints & sanity tests
├── 06_star_schema/                 # Dimensional data models:
│   ├── ecommerce/                  # Star Schema (Fact_Order_Items + 8 Dimensions)
│   └── marketing/                  # Event-Based Funnel Model (MQL -> Closed Deals)
├── 07_Analytical_insights/         # Deep-dive SQL business queries & findings
├── 08_power_bi_dashboard/          # Power BI Desktop files, DAX measures & screenshots
├── index.html                      # Interactive web dashboard interface
├── styles.css                      # Modern dark-mode styling & responsive layout
├── app.js                          # Dynamic Chart.js analytics & navigation engine
└── vercel.json                     # Production deployment routing configuration
```

---

## 📐 Data Modeling Strategy

### 1. E-Commerce Domain: Star Schema
Transactional data is structured into a Star Schema optimized for OLAP aggregations and BI reporting:
- **Fact Table:** `Fact_Order_Items` (granular item-level transactions)
- **Dimension Tables:** `Dim_Customers`, `Dim_Products`, `Dim_Sellers`, `Dim_Orders`, `Dim_Payments`, `Dim_Reviews`, `Dim_Geolocation`, `Dim_Category_Translation`

### 2. Marketing Funnel: Event-Based Logical Model
Marketing leads do not naturally fit a star schema. Instead, an event-driven funnel design tracks stage progression:
- `marketing_qualified_leads` (Top of Funnel: origin, landing page date)
- `marketing_closed_deals` (Bottom of Funnel: won date, business segment, declared revenue)
- Linked via `mql_id` with controlled joins to measure stage drop-offs.

---

## 🔍 Key Business Insights (SQL Highlights)

### 1. Customer Geography & Retention
- **São Paulo (SP)** generates **43.4%** of all orders, followed by Rio de Janeiro (RJ: 13.4%) and Minas Gerais (MG: 12.1%).
- **Repeat Purchase Rate is 3.02%**, highlighting that Olist operates primarily as a first-time discovery platform.

### 2. Logistics & Delivery Performance
- Overall **on-time delivery rate is 93.4%** (6.6% late orders).
- Delivery times vary drastically by region: **Southeast states (SP, RJ) average 8–9 days**, while **Northern states (RR, AP, AM) exceed 25–28 days**.
- **Customer Satisfaction Impact:** Orders delivered on time scored an average **4.22 / 5.0**, whereas late deliveries dropped sharply to **2.64 / 5.0**.

### 3. Product & Pricing Dynamics
- **Top Revenue Categories:** *Health & Beauty* (R$ 1.25M), *Watches & Gifts* (R$ 1.20M), and *Bed & Bath* (R$ 1.03M).
- **Weight vs. Price Correlation:** Products under 500g average R$ 94.35, while items over 5kg average R$ 247.85.

### 4. Payment Behavior
- **73.9% of transactions** are made via **Credit Card**, 19.0% by Boleto Bancário, 5.6% by Voucher, and 1.5% by Debit Card.
- **52.4% of credit card transactions** utilize installments (average 3.65 installments per order).

### 5. Seller Acquisition Funnel
- **Conversion Efficiency:** 8,000 MQLs produced 842 closed deals (**10.53% overall conversion**).
- **Best Acquisition Channel:** **Organic Search** generated the highest conversion rate at **16.8%**.
- **Revenue Quality:** Acquired sellers with officially registered legal companies declared **72% higher monthly revenue** (R$ 31.4k vs. R$ 18.2k).

---

## 💻 Tech Stack & Tools

- **Database:** PostgreSQL (DDL schemas, constraints, indexing, analytical queries)
- **Data Modeling:** Star Schema (Kimball methodology) & Event-based Funnel
- **Business Intelligence:** Power BI Desktop, DAX Measures, Data Modeling
- **Web Frontend:** HTML5, CSS3 (Modern Glassmorphic Dark System), JavaScript (ES6+)
- **Data Visualization:** Chart.js 4.4
- **Hosting & CI/CD:** Vercel

---

## ⚡ How to Run Locally

### 1. Web Dashboard
No build steps or dependencies required!
```bash
# Clone the repository
git clone https://github.com/pawangupta3401-art/end-to-end-ecommerce-analytics.git
cd end-to-end-ecommerce-analytics

# Open dashboard in any browser
# Windows:
start index.html

# Mac/Linux:
open index.html
```

### 2. PostgreSQL Database Setup
1. Create a database in PostgreSQL:
   ```sql
   CREATE DATABASE olist_analytics;
   ```
2. Execute the DDL table creation scripts:
   - `03_ddl_table_creation/ecommerce/olist_ecommerce_tables.sql`
   - `03_ddl_table_creation/marketing/olist_marketing_tables.sql`
3. Load Kaggle CSV datasets using the COPY scripts in `04_dml_data_load/`.
4. Run analytical queries from `07_Analytical_insights/`.

### 3. Power BI Reports
- Download the `.pbix` file using the links provided in `08_power_bi_dashboard/olist_dashboard_link.md`.
- Open with Power BI Desktop to interact with slicers, filters, and DAX calculations.

---

## 👤 Author

- **Pawan Gupta**
- **GitHub:** [@pawangupta3401-art](https://github.com/pawangupta3401-art)
- **Live Project:** [https://olist-ecommerce-analytics-kappa.vercel.app](https://olist-ecommerce-analytics-kappa.vercel.app)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details. Datasets are courtesy of Olist and Kaggle.
