"use strict";(()=>{var e={};e.id=18,e.ids=[18],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},43948:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>g,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var a={};r.r(a),r.d(a,{POST:()=>c});var n=r(49303),o=r(88716),i=r(60670),s=r(87070);let l=new(r(11258)).$D(process.env.GEMINI_API_KEY||"");async function c(e){try{if(!process.env.GEMINI_API_KEY)return s.NextResponse.json({error:"GEMINI_API_KEY is not configured in environment variables."},{status:500});let{startupName:t,sector:r,description:a}=await e.json();if(!t)return s.NextResponse.json({error:"Startup name is required"},{status:400});let n=l.getGenerativeModel({model:"gemini-2.5-flash",generationConfig:{responseMimeType:"application/json"}}),o=`
        You are an elite OSINT (Open Source Intelligence) Data Engineer and Intelligence Analyst specializing in deep-tech and startup viability analysis.
        
        Analyze the following startup concept based on standard metrics, market physics, regulatory frameworks, and general industry trends:
        Name: ${t}
        Sector: ${r}
        Description: ${a||"An emerging startup."}
        
        Generate a comprehensive, mathematically-aligned intelligence report formatted EXACTLY as a JSON object, with NO markdown formatting, no backticks, and no extra text. 
        It MUST be valid JSON parsable by JSON.parse().
        
        Required JSON Structure:
        {
            "executiveSummary": "A highly professional, deep-tech 3-sentence executive summary of the startup's market positioning and disruption potential.",
            "metrics": {
                "projectedGrowth": 25.4,
                "marketSize": "String representation (e.g. $4.5B)",
                "growthTrend": [
                    {"month": "M1", "value": 12}, {"month": "M2", "value": 15}, {"month": "M3", "value": 14}, 
                    {"month": "M4", "value": 18}, {"month": "M5", "value": 22}, {"month": "M6", "value": 25.4}
                ],
                "sentiment": {
                    "score": 78,
                    "positive": 65,
                    "neutral": 20,
                    "negative": 15
                }
            },
            "riskAnalysis": {
                "overall": "Low",
                "radar": [
                    { "category": "Regulatory", "score": 85 },
                    { "category": "Market", "score": 40 },
                    { "category": "Execution", "score": 60 },
                    { "category": "Financial", "score": 30 },
                    { "category": "Technology", "score": 20 }
                ],
                "regulatoryNotes": "Detailed, professional paragraph on compliance hurdles directly related to their sector."
            },
            "founderIntelligence": {
                "background": "Professional breakdown of founder execution capability.",
                "credibilityScore": 92
            },
            "competitors": [
                { "name": "Competitor 1", "threatLevel": "High", "marketShare": 35 },
                { "name": "Competitor 2", "threatLevel": "Medium", "marketShare": 15 },
                { "name": "Competitor 3", "threatLevel": "Low", "marketShare": 5 }
            ]
        }
        `,i=await n.generateContent(o),c=(await i.response).text().replace(/```json/g,"").replace(/```/g,"").trim(),p=JSON.parse(c);return s.NextResponse.json(p)}catch(e){return console.error("OSINT Generation Error:",e),s.NextResponse.json({error:"Failed to generate OSINT report. Please check API key and try again."},{status:500})}}let p=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/osint/route",pathname:"/api/osint",filename:"route",bundlePath:"app/api/osint/route"},resolvedPagePath:"/home/lucifer/Documents/Projects/EPICS Ayush/ayush-portal/app/api/osint/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:m}=p,g="/api/osint/route";function h(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,972,258],()=>r(43948));module.exports=a})();