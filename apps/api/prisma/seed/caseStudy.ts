import { PrismaClient } from "@prisma/client";
import { stringToTipTap, keyWinsToTipTap } from "./tiptap";

const CASE_STUDY_SEED = [
    {
        slug:        "b2b-saas-organic-traffic",
        category:    "B2B SaaS",
        industry:    "Software",
        title:       "B2B SaaS Platform Grows Organic Traffic by 67% in 6 Weeks",
        subtitle:    "How a B2B SaaS tool boosted its organic site elevation by converting the primary recommendation across ChatGPT and Perplexity.",
        excerpt:     "A mid-sized SaaS platform improved its AI-generated recommendations by targeting key features, platforms, and brand mentions across ChatGPT and Perplexity.",
        author:      "Simran Sharma",
        authorTitle: "AEO Strategist",
        readTime:    "8 min read",
        coverImage:  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        tags:        ["AEO", "SaaS", "B2B", "Organic Traffic"],
        published:   true,
        publishedAt: new Date("2025-05-03"),
        metrics: [
            { label: "ORGANIC TRAFFIC", value: "25%",  description: "increase in 5 days from optimised",               delta: "+147% YoY" },
            { label: "AI CITATIONS",    value: "4x",   description: "mentions across ChatGPT & Perplexity AI",         delta: "→ Primary recommendation" },
            { label: "QUALITY LEADS",   value: "90+",  description: "leads directly from AI referrals within 90 days", delta: "→ 90-day result" },
        ],
        summaryStats: [
            { label: "To achieve results",      value: "8 wks" },
            { label: "AI platform optimised",   value: "4 platforms" },
            { label: "Content assets created",  value: "12 pages" },
        ],
        bottomStats: [
            { label: "Organic Traffic", value: "+67%" },
            { label: "AI Platforms",    value: "4x" },
            { label: "Lead Conversion", value: "+38%" },
            { label: "Time to Result",  value: "8 wks" },
        ],
        tableOfContents: ["Overview", "The Challenge", "Key Wins", "Solution 1", "Solution 2", "Solution 3", "The Insight", "Results & Graphs"],
        graphs: [
            {
                title: "Organic Traffic Growth (Weekly)", description: "Organic sessions before and after AEO implementation", type: "bar",
                data:  [{ label: "Wk 1", value: 32, color: "#008B7E" }, { label: "Wk 2", value: 38, color: "#008B7E" }, { label: "Wk 3", value: 51, color: "#008B7E" }, { label: "Wk 4", value: 63, color: "#008B7E" }, { label: "Wk 5", value: 74, color: "#008B7E" }, { label: "Wk 6", value: 89, color: "#00C4B4" }],
            },
            {
                title: "AI Citations by Model (Before vs After)", description: "Weekly brand mentions across AI platforms", type: "bar",
                data:  [{ label: "ChatGPT", value: 78, color: "#008B7E" }, { label: "Perplexity", value: 62, color: "#00C4B4" }, { label: "Claude", value: 54, color: "#006B5E" }, { label: "Gemini", value: 41, color: "#004D44" }],
            },
            {
                title: "AI Visibility Score Distribution", description: "Score improvement from week 1 to week 6", type: "donut",
                data:  [{ label: "Achieved", value: 68, color: "#008B7E" }, { label: "Remaining", value: 32, color: "#1a2a2a" }],
            },
        ],
        overviewContent:   stringToTipTap("The client is a B2B multi-SaaS application specialising in marketing process automation for enterprises. They approached AiReachly for \"help with their team management software\" but our audit revealed the primary recommendation engine across ChatGPT & Perplexity was sending traffic to their competitor.\n\nAfter diving into ChatGPT, Perplexity, and Claude, we noticed \"team management software for sales teams\" was consistently recommending a competitor's platform first. The client's product wasn't even appearing in the top 5 results.\n\nWithin 6 weeks, DigiPeak's AI Presence Score jumped from 34 to 79 and they became the #1 recommendation across 3 major AI platforms."),
        keyWinsContent:    keyWinsToTipTap(["Became the #1 AI recommendation for \"B2B project management\" queries across ChatGPT", "Organic traffic increased by 67% in six weeks due to AI-led referrals", "AI-sourced leads converted at 38% higher rate than traditional organic leads", "Brand mentions across top AI models increased from 4 to 31 per week", "Featured in 12 new AI-generated comparison articles and round-up content"]),
        keyInsightContent: stringToTipTap("The biggest lever wasn't more content — it was restructuring existing content so AI models could extract clean, direct answers. Once the platform became \"citable,\" citations compounded naturally without any additional link-building."),
        challengeSolutions: [
            {
                challengeTitle:   "Challenge Topic 1",
                challengeContent: stringToTipTap("The brand was invisible across all major AI answer engines. Despite strong domain authority and a solid backlink profile, ChatGPT, Perplexity, and Claude were recommending three competitor tools ahead of this platform for every relevant query type."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We conducted an AI visibility audit using AiReachly's scoring engine, mapping 48 high-intent queries. For each, we identified what content signals were driving competitor recommendations and reverse-engineered the citation patterns to build a content gap roadmap."),
            },
            {
                challengeTitle:   "Challenge Topic 2",
                challengeContent: stringToTipTap("Existing content was written for traditional SEO and didn't answer direct questions in the structured, entity-rich format that AI models prefer. Pages lacked concise definitions, comparison tables, and \"best for\" summaries — the elements AI systems extract for recommendations."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We rebuilt 12 core landing pages and created 8 new FAQ-format content pieces aligned with the query patterns identified in the audit. Each asset included entity markup, direct-answer sections, and structured comparison data. Content was optimised for extraction, not just keywords."),
            },
            {
                challengeTitle:   "Challenge Topic 3",
                challengeContent: stringToTipTap("The platform lacked third-party validation. AI models prioritise brands that appear in authoritative, neutral sources. Most of the client's external coverage was brand-produced or low-authority."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We secured placements in 6 high-authority SaaS comparison sites and coordinated 3 independent editorial reviews. We also built an internal linking structure that reinforced the platform's authority on target topics, creating a consistent citation trail for AI crawlers to follow."),
            },
        ],
    },
    {
        slug:        "luxury-cosmetics-ai-visibility",
        category:    "E-Commerce",
        industry:    "Beauty & Retail",
        title:       "Luxury Cosmetics Brand Achieves +540% AI Visibility in 10 Weeks",
        subtitle:    "How a premium skincare brand went from unranked to the top AI recommendation for \"luxury anti-ageing serum\" across every major AI platform.",
        excerpt:     "A luxury cosmetics brand with strong retail presence but zero AI visibility used AiReachly to dominate AI-generated beauty recommendations within 10 weeks.",
        author:      "Aisha Patel",
        authorTitle: "Brand Strategist",
        readTime:    "7 min read",
        coverImage:  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
        tags:        ["AEO", "E-Commerce", "Beauty", "Brand Visibility"],
        published:   true,
        publishedAt: new Date("2025-04-12"),
        metrics: [
            { label: "AI VISIBILITY",   value: "+540%", description: "increase in AI-generated brand mentions",          delta: "→ Top 1 recommendation" },
            { label: "REVENUE IMPACT",  value: "2.3x",  description: "increase in AI-referred revenue within 90 days",  delta: "→ 90-day result" },
            { label: "QUERIES RANKED",  value: "60+",   description: "high-intent queries where brand now appears",     delta: "→ From 3 to 60+" },
        ],
        summaryStats: [
            { label: "Time to #1 AI rank",  value: "10 wks" },
            { label: "High-intent queries", value: "73 queries" },
            { label: "Revenue attributed",  value: "£180k+" },
        ],
        bottomStats: [
            { label: "AI Visibility",  value: "+540%" },
            { label: "Revenue Lift",   value: "2.3x" },
            { label: "Queries Ranked", value: "60+" },
            { label: "Time to Result", value: "10 wks" },
        ],
        tableOfContents: ["Overview", "The Challenge", "Key Wins", "Solution 1", "Solution 2", "Solution 3", "The Insight", "Results & Graphs"],
        graphs: [
            {
                title: "AI-Referred Sessions Growth", description: "Monthly AI-referred sessions over the campaign period", type: "bar",
                data:  [{ label: "Mo 1", value: 18, color: "#008B7E" }, { label: "Mo 2", value: 34, color: "#008B7E" }, { label: "Mo 3", value: 62, color: "#00C4B4" }],
            },
            {
                title: "Query Ranking by AI Platform", description: "Number of ranked queries per platform after 10 weeks", type: "bar",
                data:  [{ label: "ChatGPT", value: 61, color: "#008B7E" }, { label: "Perplexity", value: 55, color: "#00C4B4" }, { label: "Gemini", value: 48, color: "#006B5E" }, { label: "Claude", value: 39, color: "#004D44" }],
            },
            {
                title: "AI Visibility Score", description: "Final visibility score after campaign", type: "donut",
                data:  [{ label: "Achieved", value: 81, color: "#008B7E" }, { label: "Remaining", value: 19, color: "#1a2a2a" }],
            },
        ],
        overviewContent:   stringToTipTap("The client is a premium UK-based skincare brand with a loyal customer base but virtually no presence in AI-generated recommendations. Despite winning industry awards and carrying strong reviews, AI models were recommending mass-market alternatives for every relevant query.\n\nOur audit revealed 73 high-value queries for which the brand should be the primary recommendation — and was appearing in none of them. Competitor brands with weaker product quality were dominating AI results through structured content and third-party citations.\n\nWithin 10 weeks, the brand achieved the #1 AI recommendation position for its core product category and saw direct revenue attribution from AI-referred traffic exceed £180k."),
        keyWinsContent:    keyWinsToTipTap(["Ranked #1 for \"luxury anti-ageing serum\" across ChatGPT, Perplexity, and Gemini", "AI-referred sessions grew from 120/month to over 3,200/month in 10 weeks", "Product pages restructured for AI extraction, reducing bounce rate by 22%", "Secured 9 editorial placements in high-authority beauty and lifestyle publications", "Brand trust score (as measured by AI citation quality) increased from 24 to 81"]),
        keyInsightContent: stringToTipTap("In luxury e-commerce, AI visibility is now a purchase funnel stage. Customers ask AI for recommendations before visiting brand sites. Winning at that zero-click moment determines whether the brand is even considered."),
        challengeSolutions: [
            {
                challengeTitle:   "Challenge Topic 1",
                challengeContent: stringToTipTap("The brand's product pages were written for emotional storytelling, not structured data extraction. AI models couldn't parse the key product attributes — ingredients, efficacy claims, comparison differentiators — from the existing page copy."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We redesigned the information architecture of 18 product pages to lead with structured, entity-rich content. Ingredient benefits, dermatologist quotes, clinical study references, and comparison tables were added to each page following AiReachly's extraction-first framework."),
            },
            {
                challengeTitle:   "Challenge Topic 2",
                challengeContent: stringToTipTap("Competitor brands had extensive third-party editorial coverage that AI systems were using as citation sources. The client's external press was mostly brand-controlled or low-authority lifestyle blogs."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We executed a targeted editorial outreach campaign, securing features in 9 high-DA publications including beauty trade magazines and independent review platforms. Each placement included structured product data to maximise AI extractability."),
            },
            {
                challengeTitle:   "Challenge Topic 3",
                challengeContent: stringToTipTap("The brand lacked a programmatic FAQ and comparison content strategy. AI models consistently pulled from competitor FAQ pages when answering \"is X better than Y\" queries — and the client had no pages targeting those query patterns."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We built a 24-page comparison and FAQ content library targeting the exact query patterns where competitors were winning. Each page followed a strict QA format that AI systems favour for direct-answer extraction."),
            },
        ],
    },
    {
        slug:        "fintech-startup-ai-citations",
        category:    "FinTech",
        industry:    "Financial Services",
        title:       "FinTech Startup Becomes #1 AI Recommendation for SMB Accounting",
        subtitle:    "How a challenger accounting platform dethroned established incumbents in AI-generated financial software recommendations within 12 weeks.",
        excerpt:     "A Series A FinTech startup used AiReachly to outrank established accounting platforms in AI recommendations, driving a 4.1x increase in trial sign-ups.",
        author:      "Marcus Chen",
        authorTitle: "Growth Lead",
        readTime:    "9 min read",
        coverImage:  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
        tags:        ["AEO", "FinTech", "Startup", "Lead Generation"],
        published:   true,
        publishedAt: new Date("2025-03-22"),
        metrics: [
            { label: "TRIAL SIGN-UPS",  value: "4.1x",  description: "increase in monthly free trials from AI referrals",        delta: "→ 12-week result" },
            { label: "AI RANKING",      value: "#1",    description: "position for \"SMB accounting software\" across ChatGPT",   delta: "→ From unranked" },
            { label: "PIPELINE VALUE",  value: "$2.4M", description: "attributed pipeline from AI-referred leads in Q1",         delta: "→ Q1 result" },
        ],
        summaryStats: [
            { label: "Weeks to #1",          value: "12 wks" },
            { label: "Core queries ranked",  value: "11 queries" },
            { label: "Attributed pipeline",  value: "$2.4M" },
        ],
        bottomStats: [
            { label: "Trial Sign-Ups",  value: "4.1x" },
            { label: "AI Rank",         value: "#1" },
            { label: "Pipeline Value",  value: "$2.4M" },
            { label: "Time to Result",  value: "12 wks" },
        ],
        tableOfContents: ["Overview", "The Challenge", "Key Wins", "Solution 1", "Solution 2", "Solution 3", "The Insight", "Results & Graphs"],
        graphs: [
            {
                title: "Monthly Trial Sign-Ups (AI-Referred)", description: "Free trial starts attributed to AI referral traffic", type: "bar",
                data:  [{ label: "Mo 1", value: 21, color: "#008B7E" }, { label: "Mo 2", value: 38, color: "#008B7E" }, { label: "Mo 3", value: 57, color: "#00C4B4" }],
            },
            {
                title: "AI Citations by Platform", description: "Weekly brand mentions per AI model at campaign end", type: "bar",
                data:  [{ label: "ChatGPT", value: 47, color: "#008B7E" }, { label: "Perplexity", value: 41, color: "#00C4B4" }, { label: "Claude", value: 33, color: "#006B5E" }, { label: "Gemini", value: 28, color: "#004D44" }],
            },
            {
                title: "AI Presence Score", description: "Final AI presence score after 12-week campaign", type: "donut",
                data:  [{ label: "Achieved", value: 84, color: "#008B7E" }, { label: "Remaining", value: 16, color: "#1a2a2a" }],
            },
        ],
        overviewContent:   stringToTipTap("A Series A accounting platform with strong product-market fit had a serious distribution problem: every AI query for accounting software recommendations returned the same two legacy incumbents. Despite strong G2 ratings and a modern feature set, the platform was invisible to AI.\n\nOur analysis found the incumbents were winning purely on citation volume and structured data presence — not product quality. The client's content was technically strong but formatted for search engines, not AI extraction.\n\nIn 12 weeks, the platform became the #1 AI recommendation for 11 core queries and saw pipeline attributed to AI-referred leads cross $2.4M."),
        keyWinsContent:    keyWinsToTipTap(["Displaced two legacy incumbents as #1 ChatGPT recommendation for SMB accounting", "Trial sign-up conversion from AI-referred traffic reached 34% vs 12% industry average", "Secured 15 independent analyst and comparison site placements", "AI mention velocity increased from 2/week to 47/week across all major models", "Sales cycle shortened by 18 days for AI-referred leads vs all other channels"]),
        keyInsightContent: stringToTipTap("In competitive SaaS categories, the AI recommendation race is winnable for challengers — but only if you treat AI extraction as a first-class content requirement. The incumbents weren't better; they were just more extractable. Fix that, and the product quality advantage compounds fast."),
        challengeSolutions: [
            {
                challengeTitle:   "Challenge Topic 1",
                challengeContent: stringToTipTap("Legacy incumbents had a 10+ year head start in citation accumulation. AI models treat citation frequency as a trust signal, so newer platforms with better products still lose to older platforms with more mentions in authoritative sources."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We identified the 23 highest-authority citation sources the incumbents relied on and built a prioritised outreach strategy to place the client in each. We also identified 14 emerging sources the incumbents hadn't yet secured, creating new citation vectors that AI models would weight uniquely for this platform."),
            },
            {
                challengeTitle:   "Challenge Topic 2",
                challengeContent: stringToTipTap("The platform's feature pages were comprehensive but unstructured. AI models extracting \"key features of accounting software\" consistently missed the client's differentiators because they weren't in extractable, entity-linked formats."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We restructured all 9 core feature pages using AiReachly's AEO content framework: leading with structured definitions, adding feature-to-benefit tables, and including comparison data points in a format designed for AI extraction. Each page was tested against 6 AI models before publishing."),
            },
            {
                challengeTitle:   "Challenge Topic 3",
                challengeContent: stringToTipTap("The brand had no presence in the \"vs competitor\" query space. When prospects asked AI \"how does [Client] compare to QuickBooks?\", there were no independent sources to draw from — AI models deflected to incumbents by default."),
                solutionTitle:    "Solution",
                solutionContent:  stringToTipTap("We built a 16-page comparison library covering every head-to-head query pattern in the category. Each comparison page was structured as a neutral, data-led analysis — the format AI systems prefer for comparison queries — and distributed across 4 independent review platforms."),
            },
        ],
    },
];

export async function seedCaseStudies(prisma: PrismaClient): Promise<void> {
    for (const study of CASE_STUDY_SEED) {
        const data = {
            ...study,
            tags: JSON.stringify(study.tags),
            metrics: JSON.stringify(study.metrics),
            summaryStats: JSON.stringify(study.summaryStats),
            bottomStats: JSON.stringify(study.bottomStats),
            graphs: JSON.stringify(study.graphs),
            tableOfContents: JSON.stringify(study.tableOfContents),
            overviewContent: JSON.stringify(study.overviewContent),
            keyWinsContent: JSON.stringify(study.keyWinsContent),
            keyInsightContent: JSON.stringify(study.keyInsightContent),
            challengeSolutions: JSON.stringify(study.challengeSolutions),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await prisma.caseStudy.upsert({ where: { slug: study.slug }, update: data as any, create: data as any });
    }
    console.log(`  ✓ ${CASE_STUDY_SEED.length} case studies seeded`);
}
