export interface Question {
  question: string;
  answers: {
    text: string;
    weights: { [key: string]: number };
  }[];
}

export const departments = {
  "Technical": "You are a problem-solver with a passion for building efficient, scalable tech. From developing platforms to optimizing systems, you make ideas come to life through code. The Technical department needs your brainpower to innovate and execute.",
  "Social Media and Content writing": "You are a storyteller and a strategist. Your way with words keeps audiences hooked, and your ideas shape the digital voice of the brand. The Social Media and Content Writing department is where your creativity thrives.",
  "Public Relations": "You’re a connector, a communicator, and a community-builder. Your strength lies in outreach and relationship-building. The Public Relations team is your playground for building inter-college bridges and engagement.",
  "Logistics": "You are the master planner—the one who keeps the chaos under control. From handling resources to executing behind-the-scenes tasks, the Logistics department thrives on your organizational brilliance.",
  "Corporate Relations": "You're professional, persuasive, and poised. From speaker outreach to sponsorships, the Corporate Relations team turns networks into assets and deals into opportunities.",
  "Digital Creatives": "Visuals are your language. You turn ideas into stunning digital graphics that speak volumes. In the Digital Creatives department, your aesthetic sense drives campaigns and designs with impact.",
  "Photography": "Your lens tells stories. Whether capturing live moments, behind-the-scenes fun, or brand reels, the Photography department lets you blend creativity with hands-on visual storytelling.",
  "Business Development and Marketing": "You think in pitches, campaigns, and results. You’re goal-driven and strategic. In the Business Development and Marketing department, you're driving the brand forward through sponsorships, strategy, and scalable impact.",
  "InHouse Creatives": "Scissors, sketch pens, cardboard, glitter—you bring spaces to life with your DIY magic. From photo booths to themed decor, InHouse Creatives is where your hands-on aesthetic ideas shine brightest."
};

export const quizQuestions: Question[] = [
  {
    question: "Which activity excites you the most in a team project?",
    answers: [
      { text: "Building the technical backend and tools to support it.", weights: { "Technical": 3 } },
      { text: "Pitching the idea to potential sponsors and partners.", weights: { "Business Development and Marketing": 3, "Corporate Relations": 2 } },
      { text: "Designing stunning visuals and promotional graphics.", weights: { "Digital Creatives": 3, "InHouse Creatives": 1 } },
      { text: "Planning and executing all logistical elements.", weights: { "Logistics": 3 } }
    ]
  },
  {
    question: "What role would you naturally take in a group preparing for a major event?",
    answers: [
      { text: "Writing scripts, captions and keeping the online buzz alive.", weights: { "Social Media and Content writing": 3 } },
      { text: "Reaching out to colleges and promoting the event for participation.", weights: { "Public Relations": 3 } },
      { text: "Setting up props and decor to bring the theme alive.", weights: { "InHouse Creatives": 3 } },
      { text: "Capturing the preparation and excitement on camera.", weights: { "Photography": 3 } }
    ]
  },
  {
    question: "Your team needs help preparing a pitch deck. What would you focus on?",
    answers: [
      { text: "Structuring the presentation with technical precision.", weights: { "Technical": 3 } },
      { text: "Creating visually compelling slides and graphics.", weights: { "Digital Creatives": 3 } },
      { text: "Writing persuasive and concise copy.", weights: { "Social Media and Content writing": 2, "Business Development and Marketing": 1 } },
      { text: "Handling the pitching and client interaction.", weights: { "Corporate Relations": 3, "Business Development and Marketing": 1 } }
    ]
  },
  {
    question: "Which of these do you find most satisfying?",
    answers: [
      { text: "Solving complex technical problems.", weights: { "Technical": 3 } },
      { text: "Creating unique decor setups for physical spaces.", weights: { "InHouse Creatives": 3 } },
      { text: "Seeing your promotional campaign go viral.", weights: { "Social Media and Content writing": 3 } },
      { text: "Capturing the perfect moment with your camera.", weights: { "Photography": 3 } }
    ]
  },
  {
    question: "What's your go-to strategy to make an event successful?",
    answers: [
      { text: "Get the word out and ensure strong participation.", weights: { "Public Relations": 3 } },
      { text: "Secure brand collaborations and sponsorships.", weights: { "Corporate Relations": 3, "Business Development and Marketing": 2 } },
      { text: "Ensure smooth on-ground operations and setup.", weights: { "Logistics": 3 } },
      { text: "Design visually immersive promotional material.", weights: { "Digital Creatives": 3 } }
    ]
  },
  {
    question: "You have a free weekend. What would you choose to do?",
    answers: [
      { text: "Tinker with tech tools or build a website.", weights: { "Technical": 3 } },
      { text: "Create DIY crafts or themed installations.", weights: { "InHouse Creatives": 3 } },
      { text: "Go out to take photos and edit them later.", weights: { "Photography": 3 } },
      { text: "Draft a new marketing campaign plan.", weights: { "Business Development and Marketing": 3 } }
    ]
  },
  {
    question: "How do you best express creativity?",
    answers: [
      { text: "Through visual content and layout design.", weights: { "Digital Creatives": 3 } },
      { text: "Writing stories, captions, or campaign ideas.", weights: { "Social Media and Content writing": 3 } },
      { text: "With hands-on crafts and decorations.", weights: { "InHouse Creatives": 3 } },
      { text: "Framing scenes through a camera lens.", weights: { "Photography": 3 } }
    ]
  },
  {
    question: "In a crisis during an event, what would you instinctively do?",
    answers: [
      { text: "Step up to coordinate and fix the issue quickly.", weights: { "Logistics": 3 } },
      { text: "Use your people skills to communicate and control panic.", weights: { "Public Relations": 3, "Corporate Relations": 2 } },
      { text: "Document the moment responsibly for future improvements.", weights: { "Photography": 2, "Social Media and Content writing": 1 } },
      { text: "Debug the problem or build a tech workaround.", weights: { "Technical": 3 } }
    ]
  },
  {
    question: "How do you prepare for a new event or project?",
    answers: [
      { text: "Start with detailed logistics planning.", weights: { "Logistics": 3 } },
      { text: "Draft outreach messages and contact colleges.", weights: { "Public Relations": 3 } },
      { text: "Build an aesthetic mood board or mockups.", weights: { "InHouse Creatives": 2, "Digital Creatives": 2 } },
      { text: "Ensure the event has proper brand visibility.", weights: { "Business Development and Marketing": 2, "Corporate Relations": 2 } }
    ]
  },
  {
    question: "What kind of recognition do you value the most?",
    answers: [
      { text: "When users praise a system you built.", weights: { "Technical": 3 } },
      { text: "When your decor makes people stop and admire.", weights: { "InHouse Creatives": 3 } },
      { text: "When a campaign you wrote gets reposted and shared widely.", weights: { "Social Media and Content writing": 3 } },
      { text: "When you secure a high-value partnership or sponsor.", weights: { "Corporate Relations": 3, "Business Development and Marketing": 2 } }
    ]
  }
];
