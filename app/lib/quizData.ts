export interface Question {
  question: string;
  answers: {
    text: string;
    weights: { [key:string]: number };
  }[];
}

export const departments = {
  "Technical": "You are a problem-solver, logical and enjoy building things. The Technical department is a perfect fit for you.",
  "Social Media and Content writing": "You are creative, a great communicator and have a knack for engaging people. The Social Media and Content Writing department is where you'll shine.",
  "Public Relations": "You are a people person, persuasive and skilled at building relationships. The Public Relations department is your calling.",
  "Logistics": "You are organized, detail-oriented and a master planner. The Logistics department needs your skills.",
  "Corporate Relations": "You are professional, a great negotiator and can connect with people at all levels. The Corporate Relations department is a great match.",
  "Digital Creatives": "You have a keen eye for aesthetics, are imaginative and love to create visually stunning content. The Digital Creatives department is your creative playground.",
  "Photography": "You have a passion for capturing moments and telling stories through images. The Photography department is the place for you.",
  "Business Development and Marketing": "You are strategic, results-driven and have a passion for growth. The Business Development and Marketing department is where you can make a big impact.",
  "InHouse Creatives": "You are artistic, innovative and love to bring ideas to life through design. The InHouse Creatives department is your ideal environment."
};

export const quizQuestions: Question[] = [
  {
    question: "A big event is coming up. What are you most excited about?",
    answers: [
      { text: "Building the tech to make it all happen smoothly.", weights: { "Technical": 3 } },
      { text: "Creating a buzz on social media and writing killer content.", weights: { "Social Media and Content writing": 3 } },
      { text: "Connecting with influential people and media.", weights: { "Public Relations": 3 } },
      { text: "Organizing everything behind the scenes to perfection.", weights: { "Logistics": 3 } }
    ]
  },
  {
    question: "You're at a networking event. What's your go-to move?",
    answers: [
      { text: "Talking to potential sponsors and partners.", weights: { "Corporate Relations": 3 } },
      { text: "Designing a stunning visual presentation on the fly.", weights: { "Digital Creatives": 3, "InHouse Creatives": 2 } },
      { text: "Capturing the best moments of the event.", weights: { "Photography": 3 } },
      { text: "Developing a marketing strategy to promote our brand.", weights: { "Business Development and Marketing": 3 } }
    ]
  },
  {
    question: "What's your ideal weekend project?",
    answers: [
      { text: "Coding a new app or website.", weights: { "Technical": 3 } },
      { text: "Writing a blog post or creating a viral video.", weights: { "Social Media and Content writing": 3 } },
      { text: "Designing beautiful graphics or editing photos.", weights: { "Digital Creatives": 2, "InHouse Creatives": 3 } },
      { text: "Planning a trip or organizing an event for friends.", weights: { "Logistics": 2, "Public Relations": 1 } }
    ]
  },
  {
    question: "How do you approach a new challenge?",
    answers: [
      { text: "Logically and systematically, breaking it down into smaller pieces.", weights: { "Technical": 3, "Logistics": 1 } },
      { text: "Creatively, thinking outside the box for a unique solution.", weights: { "Digital Creatives": 2, "InHouse Creatives": 2, "Social Media and Content writing": 1 } },
      { text: "Strategically, by building relationships and forming partnerships.", weights: { "Public Relations": 3, "Corporate Relations": 2 } },
      { text: "With a detailed plan and a focus on execution.", weights: { "Logistics": 3, "Business Development and Marketing": 1 } }
    ]
  },
  {
    question: "What kind of impact do you want to make?",
    answers: [
      { text: "Building something innovative that people love to use.", weights: { "Technical": 3 } },
      { text: "Growing a brand and reaching a wider audience.", weights: { "Business Development and Marketing": 3, "Social Media and Content writing": 1 } },
      { text: "Creating a strong, positive public image.", weights: { "Public Relations": 3 } },
      { text: "Bringing a creative vision to life.", weights: { "Digital Creatives": 3, "InHouse Creatives": 3, "Photography": 1 } }
    ]
  }
];
