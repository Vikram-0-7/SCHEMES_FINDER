"""Seed the database with real Indian government schemes."""
import sys
import os

# Add parent directories to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal, Base
from app.models import Scheme, Category


CATEGORIES = [
    {"name": "Agriculture", "icon": "🌾", "scheme_count": 0},
    {"name": "Education", "icon": "📚", "scheme_count": 0},
    {"name": "Finance", "icon": "💰", "scheme_count": 0},
    {"name": "Health", "icon": "🏥", "scheme_count": 0},
    {"name": "Housing", "icon": "🏠", "scheme_count": 0},
    {"name": "Technology", "icon": "💻", "scheme_count": 0},
    {"name": "Youth & Seniors", "icon": "👥", "scheme_count": 0},
    {"name": "Women & Children", "icon": "👩‍👧", "scheme_count": 0},
    {"name": "Employment", "icon": "💼", "scheme_count": 0},
    {"name": "Social Welfare", "icon": "🤝", "scheme_count": 0},
]


SCHEMES = [
    {
        "title": "PM Kisan Samman Nidhi",
        "description": "Under PM-Kisan scheme, income support of Rs. 6,000 per year is provided to all farmer families across the country in three equal installments of Rs. 2,000 each every four months. The fund is directly transferred to the bank accounts of the beneficiaries.",
        "category": "Agriculture",
        "state": "Central",
        "eligibility": "All landholding farmer families with cultivable land. Certain categories like institutional landholders, farmer families holding constitutional posts, serving or retired officers and employees of State/Central Government are excluded.",
        "benefits": "Rs. 6,000 per year in three installments of Rs. 2,000 each, directly transferred to bank account.",
        "documents_required": "Aadhaar Card, Land ownership documents, Bank account details, Mobile number",
        "application_url": "https://pmkisan.gov.in/",
        "source": "Ministry of Agriculture & Farmers Welfare",
        "scheme_type": "central",
        "tags": ["farmer", "agriculture", "income support", "kisan"],
    },
    {
        "title": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PMJAY)",
        "description": "World's largest health insurance scheme providing health cover of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families identified based on deprivation and occupational criteria.",
        "category": "Health",
        "state": "Central",
        "eligibility": "Families identified based on SECC 2011 database deprivation and occupational criteria. Both rural and urban poor families. No restriction on family size, age, or gender.",
        "benefits": "Health insurance cover of Rs. 5 lakh per family per year. Cashless and paperless treatment at empanelled hospitals. Over 1,500 procedures covered including pre and post hospitalization expenses.",
        "documents_required": "Aadhaar Card, Ration Card, Any government ID proof, PMJAY e-card",
        "application_url": "https://pmjay.gov.in/",
        "source": "National Health Authority",
        "scheme_type": "central",
        "tags": ["health", "insurance", "hospital", "medical", "PMJAY"],
    },
    {
        "title": "PM Awas Yojana (Urban & Rural)",
        "description": "Affordable housing for all with the mission to provide pucca houses with basic amenities to all eligible families/beneficiaries by 2024. Provides financial assistance for construction/enhancement of houses.",
        "category": "Housing",
        "state": "Central",
        "eligibility": "EWS (Annual income up to Rs. 3 lakh), LIG (Rs. 3-6 lakh), MIG-I (Rs. 6-12 lakh), MIG-II (Rs. 12-18 lakh). Beneficiary family should not own a pucca house anywhere in India.",
        "benefits": "Subsidy ranging from Rs. 1 lakh to Rs. 2.67 lakh for different categories. Interest subsidy on home loans under CLSS component.",
        "documents_required": "Aadhaar Card, Income proof, Bank account, Land documents, Photograph",
        "application_url": "https://pmaymis.gov.in/",
        "source": "Ministry of Housing and Urban Affairs",
        "scheme_type": "central",
        "tags": ["housing", "home", "construction", "shelter", "awas"],
    },
    {
        "title": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
        "description": "Guarantees 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work. This is a demand-driven wage employment programme.",
        "category": "Employment",
        "state": "Central",
        "eligibility": "Any adult member of a rural household willing to do unskilled manual work. Must be a resident of the local area (Gram Panchayat).",
        "benefits": "100 days of guaranteed wage employment per household per year. Wages at par with state minimum wages (Rs. 200-300 per day depending on state). Unemployment allowance if work not provided within 15 days.",
        "documents_required": "Job Card (MGNREGA), Aadhaar Card, Bank account details",
        "application_url": "https://nrega.nic.in/",
        "source": "Ministry of Rural Development",
        "scheme_type": "central",
        "tags": ["employment", "rural", "wage", "work", "NREGA", "labour"],
    },
    {
        "title": "Pradhan Mantri Ujjwala Yojana",
        "description": "Provides free LPG connections to women from Below Poverty Line (BPL) households to reduce health hazards associated with cooking using traditional fuels. Safeguards the health of women and children.",
        "category": "Social Welfare",
        "state": "Central",
        "eligibility": "Women from BPL households, SC/ST households, Pradhan Mantri Awas Yojana beneficiaries, Antyodaya Anna Yojana beneficiaries, Forest dwellers, Most backward class, Tea plantation workers, and inhabitants of islands/river islands.",
        "benefits": "Free LPG connection with a deposit-free LPG cylinder, pressure regulator, and booklet. Financial assistance of Rs. 1,600 per connection.",
        "documents_required": "BPL certificate, Aadhaar Card, Bank account, Passport-size photograph, Address proof",
        "application_url": "https://www.pmujjwalayojana.com/",
        "source": "Ministry of Petroleum & Natural Gas",
        "scheme_type": "central",
        "tags": ["LPG", "gas", "cooking", "women", "BPL", "health"],
    },
    {
        "title": "National Food Security Mission",
        "description": "Aims to increase production of rice, wheat, pulses, coarse cereals, nutri-cereals, and commercial crops through area expansion and productivity enhancement. Provides subsidized food grains.",
        "category": "Agriculture",
        "state": "Central",
        "eligibility": "Farmers in identified districts for rice, wheat, pulses, and coarse cereals. Priority to small and marginal farmers.",
        "benefits": "Subsidized improved seeds, soil amendments, micro-nutrients, farm machinery, crop demonstrations, and training to farmers.",
        "documents_required": "Land ownership documents, Aadhaar Card, Bank account, Farmer ID",
        "application_url": "https://nfsm.gov.in/",
        "source": "Ministry of Agriculture & Farmers Welfare",
        "scheme_type": "central",
        "tags": ["agriculture", "food", "farming", "crop", "production"],
    },
    {
        "title": "Weather-Based Crop Insurance Scheme",
        "description": "Provides insurance coverage and financial support to farmers in the event of crop failure due to adverse weather conditions such as deficit/excess rainfall, frost, heatwave, etc.",
        "category": "Agriculture",
        "state": "Central",
        "eligibility": "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas. Both loanee and non-loanee farmers.",
        "benefits": "Insurance payouts based on weather triggers (rainfall, temperature, humidity). Premium subsidy from central and state government. Farmers pay only 1.5-5% of sum insured.",
        "documents_required": "Land records, Bank account, Aadhaar Card, Crop sowing certificate",
        "application_url": "https://pmfby.gov.in/",
        "source": "Ministry of Agriculture & Farmers Welfare",
        "scheme_type": "central",
        "tags": ["insurance", "crop", "weather", "farming", "agriculture"],
    },
    {
        "title": "AICTE Scholarship Scheme for Students",
        "description": "Various scholarships offered by AICTE for students pursuing technical education including Pragati (for girls), Saksham (for differently-abled), and merit-based scholarships.",
        "category": "Education",
        "state": "Central",
        "eligibility": "Students admitted to AICTE-approved institutions pursuing degree/diploma courses in engineering, technology, architecture, management, pharmacy, and applied arts.",
        "benefits": "Scholarships ranging from Rs. 30,000 to Rs. 50,000 per year. Tuition fee waiver. Book and equipment allowance.",
        "documents_required": "10th & 12th mark sheets, Admission letter, Income certificate, Aadhaar Card, Bank account, Caste certificate (if applicable)",
        "application_url": "https://scholarships.gov.in/",
        "source": "AICTE - All India Council for Technical Education",
        "scheme_type": "central",
        "tags": ["education", "scholarship", "student", "technical", "AICTE"],
    },
    {
        "title": "Post-Matric Scholarships for Minority Communities",
        "description": "Financial assistance to students belonging to minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) for pursuing higher studies from post-matric to PhD level.",
        "category": "Education",
        "state": "Central",
        "eligibility": "Students belonging to notified minority communities. Family annual income should not exceed Rs. 2 lakh. Must have secured at least 50% marks in the previous examination.",
        "benefits": "Admission/tuition fee, maintenance allowance, and course fee. Amount varies based on day scholar/hosteler and level of study.",
        "documents_required": "Community certificate, Income certificate, Mark sheets, Aadhaar Card, Bank account, Admission proof",
        "application_url": "https://scholarships.gov.in/",
        "source": "Ministry of Minority Affairs",
        "scheme_type": "central",
        "tags": ["education", "scholarship", "minority", "student"],
    },
    {
        "title": "Startup India",
        "description": "Flagship initiative to build a strong ecosystem for startups in India. Provides tax exemptions, easier compliance, IPR fast-tracking, and funding support through Fund of Funds.",
        "category": "Technology",
        "state": "Central",
        "eligibility": "Entity incorporated as private limited company, registered partnership firm, or LLP. Annual turnover should not exceed Rs. 100 crore. Entity should be working towards innovation/development of new products. Should not be formed by splitting or reconstruction of existing business.",
        "benefits": "Tax exemption for 3 consecutive years out of 10 years. Self-certification compliance. Fast-track patent application. Fund of Funds. Government tenders exemption. Easy winding up process.",
        "documents_required": "Certificate of Incorporation, PAN Card, Business plan, DPIIT recognition certificate",
        "application_url": "https://www.startupindia.gov.in/",
        "source": "Department for Promotion of Industry and Internal Trade",
        "scheme_type": "central",
        "tags": ["startup", "business", "entrepreneur", "technology", "innovation"],
    },
    {
        "title": "Digital India Programme",
        "description": "Transformative programme to transform India into a digitally empowered society and knowledge economy. Encompasses multiple projects for digital infrastructure, digital literacy, and e-governance.",
        "category": "Technology",
        "state": "Central",
        "eligibility": "Various sub-schemes have different eligibility. Generally available to all Indian citizens, government bodies, startups, and businesses.",
        "benefits": "Digital infrastructure in every village. Digital literacy training. E-governance services. BPO/IT promotion in tier 2/3 cities. Common Service Centers for digital services.",
        "documents_required": "Aadhaar Card, Valid ID proof (varies by sub-scheme)",
        "application_url": "https://digitalindia.gov.in/",
        "source": "Ministry of Electronics and Information Technology",
        "scheme_type": "central",
        "tags": ["technology", "digital", "IT", "e-governance", "literacy"],
    },
    {
        "title": "Beti Bachao Beti Padhao",
        "description": "National campaign to generate awareness and improve the efficiency of welfare services intended for girls. Addresses the declining child sex ratio and promotes education of girls.",
        "category": "Women & Children",
        "state": "Central",
        "eligibility": "All girl children across India. Special focus on gender-critical districts identified based on low Child Sex Ratio.",
        "benefits": "Multi-sectoral interventions for girl child survival, protection, and education. Awareness campaigns. Skill development programs. Financial incentives in select states.",
        "documents_required": "Birth certificate of girl child, Aadhaar Card (parent), Bank account",
        "application_url": "https://wcd.nic.in/bbbp-schemes",
        "source": "Ministry of Women and Child Development",
        "scheme_type": "central",
        "tags": ["women", "girl", "education", "child", "gender"],
    },
    {
        "title": "Pradhan Mantri Mudra Yojana (PMMY)",
        "description": "Provides loans up to Rs. 10 lakh to non-corporate, non-farm small/micro enterprises. Loans are given under three categories — Shishu (up to Rs. 50,000), Kishore (Rs. 50,001 to Rs. 5 lakh), and Tarun (Rs. 5,00,001 to Rs. 10 lakh).",
        "category": "Finance",
        "state": "Central",
        "eligibility": "Any Indian citizen with a business plan for a non-farm sector income generating activity. Manufacturing, trading, services sector, and activities allied to agriculture. No collateral required.",
        "benefits": "Loans up to Rs. 10 lakh without collateral. Shishu: up to Rs. 50,000, Kishore: up to Rs. 5 lakh, Tarun: up to Rs. 10 lakh. Mudra Card for working capital management.",
        "documents_required": "Identity proof, Address proof, Business plan/proposal, Proof of business (if existing), Passport photos, Caste certificate (if applicable)",
        "application_url": "https://www.mudra.org.in/",
        "source": "MUDRA / Ministry of Finance",
        "scheme_type": "central",
        "tags": ["loan", "business", "entrepreneur", "MUDRA", "finance", "MSME"],
    },
    {
        "title": "Sukanya Samriddhi Yojana",
        "description": "Small deposit scheme for the girl child launched as part of Beti Bachao Beti Padhao campaign. Offers one of the highest interest rates among all government savings schemes.",
        "category": "Finance",
        "state": "Central",
        "eligibility": "Account can be opened for a girl child below 10 years of age. Only one account per girl child. Maximum two accounts per family (exception for twins/triplets).",
        "benefits": "Interest rate of 8.2% per annum (subject to quarterly revision). Tax benefits under Section 80C. Maturity after 21 years from date of opening. Partial withdrawal allowed after girl turns 18.",
        "documents_required": "Birth certificate of girl child, ID proof of parent/guardian, Address proof, Photographs",
        "application_url": "https://www.india.gov.in/sukanya-samriddhi-yojna",
        "source": "Ministry of Finance",
        "scheme_type": "central",
        "tags": ["savings", "girl", "investment", "finance", "child"],
    },
    {
        "title": "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
        "description": "National Mission for Financial Inclusion to ensure access to financial services like banking/savings & deposit accounts, remittance, credit, insurance, and pension in an affordable manner.",
        "category": "Finance",
        "state": "Central",
        "eligibility": "Any Indian citizen above 10 years of age who does not have a bank account. Both rural and urban areas.",
        "benefits": "Zero balance bank account. RuPay Debit Card with Rs. 2 lakh accident insurance. Overdraft facility up to Rs. 10,000. Life insurance cover of Rs. 30,000. Direct Benefit Transfer.",
        "documents_required": "Aadhaar Card (or any valid ID), Address proof, Passport-size photograph",
        "application_url": "https://pmjdy.gov.in/",
        "source": "Department of Financial Services",
        "scheme_type": "central",
        "tags": ["banking", "financial inclusion", "account", "finance"],
    },
    {
        "title": "Pradhan Mantri Matri Vandana Yojana (PMMVY)",
        "description": "Maternity benefit programme providing partial compensation for wage loss during pregnancy and childbirth. Cash incentive of Rs. 5,000 in three installments for the first living child.",
        "category": "Women & Children",
        "state": "Central",
        "eligibility": "Pregnant women and lactating mothers for the first living child. Women employed in central/state government or PSU are not eligible.",
        "benefits": "Rs. 5,000 in three installments: Rs. 1,000 on early registration, Rs. 2,000 after 6 months of pregnancy, Rs. 2,000 after child birth registration and first cycle of vaccination.",
        "documents_required": "MCP Card, Aadhaar Card, Bank account, Pregnancy registration proof",
        "application_url": "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
        "source": "Ministry of Women and Child Development",
        "scheme_type": "central",
        "tags": ["maternity", "pregnancy", "women", "child", "health"],
    },
    {
        "title": "PM Vishwakarma Yojana",
        "description": "Scheme to provide end-to-end support to artisans and craftspeople who work with their hands and tools. Covers 18 traditional trades including carpenter, blacksmith, goldsmith, potter, and more.",
        "category": "Employment",
        "state": "Central",
        "eligibility": "Traditional artisans and craftspeople working in 18 identified trades. Age 18 years or above. Should be engaged in self-employment basis in unorganized sector.",
        "benefits": "Recognition through PM Vishwakarma certificate and ID card. Skill training (Basic: 5-7 days, Advanced: 15 days). Toolkit incentive of Rs. 15,000. Collateral-free credit up to Rs. 3 lakh. Marketing support.",
        "documents_required": "Aadhaar Card, Trade-related proof, Bank account, Photograph, Mobile number",
        "application_url": "https://pmvishwakarma.gov.in/",
        "source": "Ministry of Micro, Small & Medium Enterprises",
        "scheme_type": "central",
        "tags": ["artisan", "craft", "skill", "training", "employment", "traditional"],
    },
    {
        "title": "Atal Pension Yojana",
        "description": "Pension scheme for unorganized sector workers. Provides a guaranteed minimum monthly pension of Rs. 1,000 to Rs. 5,000 after attaining 60 years of age, depending on the contribution.",
        "category": "Finance",
        "state": "Central",
        "eligibility": "Indian citizens aged 18-40 years. Must have a savings bank account. Should not be a member of any statutory social security scheme.",
        "benefits": "Guaranteed monthly pension of Rs. 1,000/2,000/3,000/4,000/5,000 after age 60. Equal government co-contribution for 5 years for subscribers who join before March 2016. Spouse pension in case of death.",
        "documents_required": "Aadhaar Card, Bank account, Mobile number",
        "application_url": "https://www.npscra.nsdl.co.in/scheme-details.php",
        "source": "Pension Fund Regulatory and Development Authority",
        "scheme_type": "central",
        "tags": ["pension", "retirement", "savings", "elderly", "senior"],
    },
    {
        "title": "Manipur State Portal (Citizen Services)",
        "description": "Integrated digital portal for accessing various state government services, certificates, and welfare schemes specific to the state of Manipur including income certificates, caste certificates, and domicile certificates.",
        "category": "Technology",
        "state": "Manipur",
        "eligibility": "Residents of Manipur with valid state documentation.",
        "benefits": "Online access to state government services. Digital certificate issuance. Scheme application and tracking. Grievance redressal.",
        "documents_required": "State resident proof, Aadhaar Card, Manipur domicile certificate",
        "application_url": "https://manipur.gov.in/",
        "source": "Government of Manipur",
        "scheme_type": "state",
        "tags": ["manipur", "state", "digital", "e-governance", "certificate"],
    },
    {
        "title": "Pradhan Mantri Fasal Bima Yojana",
        "description": "Crop insurance scheme providing comprehensive risk coverage to farmers against failure of the crop, helping to stabilize their income. Covers all Food and Oilseed crops and Annual Commercial/Horticultural crops.",
        "category": "Agriculture",
        "state": "Central",
        "eligibility": "All farmers including sharecroppers and tenant farmers. Both loanee and non-loanee farmers growing notified crops.",
        "benefits": "Premium rate: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops. Balance premium paid by government. Full sum insured coverage. Post-harvest loss coverage for 14 days.",
        "documents_required": "Land records, Bank account, Aadhaar Card, Sowing certificate, Loan documents (if loanee farmer)",
        "application_url": "https://pmfby.gov.in/",
        "source": "Ministry of Agriculture & Farmers Welfare",
        "scheme_type": "central",
        "tags": ["insurance", "crop", "fasal", "bima", "agriculture", "farmer"],
    },
    {
        "title": "AICTE Pragati Scholarship Scheme for Girl Students",
        "description": "Scholarship for meritorious girl students pursuing technical education in AICTE-approved institutions. Provides financial assistance to ensure they continue and complete their education.",
        "category": "Education",
        "state": "Central",
        "eligibility": "Girl students admitted to first year of degree/diploma programme in AICTE-approved institution. Family annual income should not exceed Rs. 8 lakh. Only one girl per family.",
        "benefits": "Rs. 50,000 per annum or tuition fee/college fee (whichever is less). Rs. 2,000 per month for 10 months for incidental charges.",
        "documents_required": "Admission letter, Income certificate, Aadhaar Card, Bank account, Mark sheets, College ID",
        "application_url": "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
        "source": "AICTE",
        "scheme_type": "central",
        "tags": ["education", "scholarship", "girl", "women", "technical"],
    },
    {
        "title": "Post-Matric Scholarships for Students belonging to Minority Communities",
        "description": "Scholarship for students from minority communities pursuing post-matric courses. Aims to support, encourage and assist students from minority communities to complete education.",
        "category": "Education",
        "state": "Central",
        "eligibility": "Students belonging to Muslim, Christian, Sikh, Buddhist, Jain, Parsi communities. Family annual income should not exceed Rs. 2 lakh. Minimum 50% marks in previous examination.",
        "benefits": "Admission and tuition fees. Maintenance allowance for hostelers and day scholars. Course/Examination fee.",
        "documents_required": "Community/Minority certificate, Income certificate, Mark sheets, Aadhaar Card, Bank account, Admission proof",
        "application_url": "https://scholarships.gov.in/",
        "source": "Ministry of Minority Affairs",
        "scheme_type": "central",
        "tags": ["education", "scholarship", "minority", "student", "post-matric"],
    },
    {
        "title": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        "description": "Flagship skill certification scheme of the Ministry of Skill Development. Enables Indian youth to take up industry-relevant skill training that will help them in securing a better livelihood.",
        "category": "Employment",
        "state": "Central",
        "eligibility": "Indian youth aged 15-45 years. School/college dropouts or unemployed can enroll. Prior learning assessment available for experienced workers.",
        "benefits": "Free skill training (150-300 hours per course). Industry-recognized certificate. Assessment and certification by independent bodies. Placement support. Monetary reward on successful certification.",
        "documents_required": "Aadhaar Card, Bank account, Educational certificates (if any), Photograph",
        "application_url": "https://www.pmkvyofficial.org/",
        "source": "Ministry of Skill Development and Entrepreneurship",
        "scheme_type": "central",
        "tags": ["skill", "training", "employment", "youth", "certification"],
    },
    {
        "title": "PM SVANidhi - Street Vendor's AtmaNirbhar Nidhi",
        "description": "Micro-credit facility providing affordable loans to street vendors to resume their livelihood. Part of the Atmanirbhar Bharat Abhiyan for economic recovery.",
        "category": "Finance",
        "state": "Central",
        "eligibility": "Street vendors engaged in vending in urban areas. Must possess a Certificate of Vending or Letter of Recommendation from Urban Local Body.",
        "benefits": "Working capital loan of Rs. 10,000 (1st loan), Rs. 20,000 (2nd loan), Rs. 50,000 (3rd loan). Interest subsidy of 7%. Monthly cashback incentive for digital transactions.",
        "documents_required": "Certificate of Vending, Aadhaar Card, Bank account, Photograph, Mobile number",
        "application_url": "https://pmsvanidhi.mohua.gov.in/",
        "source": "Ministry of Housing and Urban Affairs",
        "scheme_type": "central",
        "tags": ["vendor", "street", "loan", "micro-credit", "urban"],
    },
]


def seed_database():
    """Create tables and seed data."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

    db = SessionLocal()
    try:
        # Check if data already exists
        existing_schemes = db.query(Scheme).count()
        if existing_schemes > 0:
            print(f"Database already has {existing_schemes} schemes. Skipping seed.")
            return

        # Seed categories
        print("Seeding categories...")
        for cat_data in CATEGORIES:
            category = Category(**cat_data)
            db.add(category)
        db.commit()
        print(f"Added {len(CATEGORIES)} categories.")

        # Seed schemes
        print("Seeding schemes...")
        for scheme_data in SCHEMES:
            scheme = Scheme(**scheme_data)
            db.add(scheme)
        db.commit()
        print(f"Added {len(SCHEMES)} schemes.")

        # Update category counts
        print("Updating category counts...")
        for cat in db.query(Category).all():
            count = db.query(Scheme).filter(Scheme.category == cat.name).count()
            cat.scheme_count = count
        db.commit()

        print("[OK] Database seeded successfully!")

    except Exception as e:
        print(f"[ERROR] Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
