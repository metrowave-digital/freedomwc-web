export interface WeekItem {
  week: number;
  title: string;
  scripture: string;
}

export interface CurriculumPhase {
  phase: number;
  title: string;
  duration: string;
  color: "Blue" | "Purple" | "Green" | "Gold";
  description: string;
  weeks: WeekItem[];
}

export const curriculum: CurriculumPhase[] = [
  {
    phase: 1,
    title: "RESTORE | Identity & Awakening",
    duration: "Weeks 1–6",
    color: "Blue",
    description:
      "This phase focuses on establishing a firm spiritual identity rooted in Christ, integrating historical and cultural awareness, and beginning the deep work of self-discovery and shadow acknowledgement.",
    weeks: [
      {
        week: 1,
        title: "The Sankofa Principle",
        scripture: " Jeremiah 6:16",
      },
      {
        week: 2,
        title: "Imago Dei & The Cloud of Witnesses",
        scripture: "Genesis 1:26-27; Hebrews 12:1",
      },
      {
        week: 3,
        title: "The Maafa & The Mirror (Healing Trauma)",
        scripture: "Isaiah 61:1-3",
      },
      {
        week: 4,
        title: "Nommo: The Power of the Word",
        scripture: "Proverbs 18:21; Romans 4:17",
      },
      {
        week: 5,
        title: "Divine Design (Personality Discovery)",
        scripture: "Psalm 139:13-14",
      },
      {
        week: 6,
        title: "Awakening the Ashé (The Spirit Within)",
        scripture: "Acts 1:8; 2 Timothy 1:6",
      },
    ],
  },

  {
    phase: 2,
    title: "ROOT | Formation & Discipline",
    duration: "Weeks 7–14",
    color: "Purple",
    description:
      "This phase focuses on cultivating sustainable spiritual rhythms, deepening communal bonds through Ubuntu, and mastering the relational disciplines necessary for a lifetime of faithful walk.",
    weeks: [
      { week: 7, title: "The Drumbeat of Prayer", 
        scripture: "Luke 5:16; 1 Thessalonians 5:17" },
      {
        week: 8,
        title: "Languages of the Heart (Love Languages)",
        scripture: "1 John 3:18",
      },
      {
        week: 9,
        title: "Ubuntu & The Discipline of Community",
        scripture: "Ecclesiastes 4:9-10; Acts 2:42-44",
      },
      {
        week: 10,
        title: "The Palaver Tree (The Ministry of Reconciliation)",
        scripture: "2 Corinthians 5:18-19",
      },
      {
        week: 11,
        title: "Wisdom of the Elders (Scripture & Study)",
        scripture: "Joshua 1:8",
      },
      {
        week: 12,
        title: "The Sacred Bush (Silence & Solitude)",
        scripture: "Psalm 46:10; Mark 6:31",
      },
      {
        week: 13,
        title: "Fasting & Cleansing",
        scripture: "Isaiah 58:6",
      },
      {
        week: 14,
        title: "Stewardship of the Land & Body",
        scripture: "1 Corinthians 6:19-20",
      },
    ],
  },

  {
    phase: 3,
    title: "RISE | Activation & Leadership",
    duration: "Weeks 15–20",
    color: "Green",
    description:
      "This phase focuses on the transition from believer to leader, activating spiritual gifts with emotional intelligence (Itutu), and embracing the responsibility of spiritual authority.",
    weeks: [
      {
        week: 15,
        title: "The Crossing (Rites of Passage)",
        scripture: "1 Corinthians 13:11",
      },
      {
        week: 16,
        title: "Unlocking the Toolkit (Spiritual Gifts)",
        scripture: "Romans 12; 1 Corinthians 12; Ephesians 4",
      },
      {
        week: 17,
        title: "Itutu: Coolness of Character (EQ)",
        scripture: "Galatians 5:22-23",
      },
      {
        week: 18,
        title: "Spiritual Discernment",
        scripture: "Hebrews 5:14",
      },
      {
        week: 19,
        title: "The Chief Who Serves",
        scripture: "Mark 10:42-45",
      },
      {
        week: 20,
        title: "The Mantle & The Anointing",
        scripture: "2 Kings 2:9; Isaiah 10:27",
      },
    ],
  },

  {
    phase: 4,
    title: "RELEASE | Mission & Impact",
    duration: "Weeks 21–28",
    color: "Gold",
    description:
      "This phase focuses on the practical deployment of one's calling, engaging in cooperative economics (Ujamaa), and strategically building a legacy that impacts the broader culture.",
    weeks: [
      {
        week: 21,
        title: "Harambee: Collective Work",
        scripture: "Nehemiah 2:18",
      },
      {
        week: 22,
        title: "Ujamaa: Kingdom Economics",
        scripture: "Deuteronomy 8:18; Acts 4:32",
      },
      {
        week: 23,
        title: "Mission as Liberation",
        scripture: "Luke 4:18-19",
      },
      {
        week: 24,
        title: "The Seven Spheres",
        scripture: "Matthew 5:13-14",
      },
      {
        week: 25,
        title: "Building the Village",
        scripture: "Habakkuk 2:2",
      },
      {
        week: 26,
        title: "Mentorship: Pouring Libations for the Future",
        scripture: "2 Timothy 2:2",
      },
      {
        week: 27,
        title: "The Great Commission",
        scripture: "Matthew 28:19-20",
      },
      {
        week: 28,
        title: "Ancestry & Legacy",
        scripture: "Psalm 145:4; Proverbs 13:22",
      },
    ],
  },
];
