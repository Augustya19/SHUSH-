import { Article } from './types';

// ==========================================
// HOW TO ADD YOUR OWN PICTURES:
// 1. Place your image files (jpg, png) in the 'public' folder of your project.
//    (If using a standard React setup, this folder is at the root).
// 2. Update the string below to match the filename.
//    Example: "/my-period-image.jpg"
// 3. Alternatively, you can use any public URL from the internet.
// ==========================================

export const HERO_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"; // Abstract Fluid

export const MAIN_CATEGORIES: Article[] = [
  {
    id: 'period-1',
    title: 'Period 101',
    description: 'Know when your periods gonna start. What happens during your period?',
    imageUrl: '/period101.jpeg', // Soft pink flower
    category: 'Menstruation',
    fullPrompt: 'Explain the menstrual cycle in a simple, friendly way for young women. Include phases and what to expect.'
  },
  {
    id: 'nutrition-1',
    title: 'Cycle Nutrition',
    description: 'Fuel your body right during every phase of your cycle.',
    imageUrl: '/green.jpeg', // Healthy bowl
    category: 'Nutrition',
    fullPrompt: 'How does nutrition affect the menstrual cycle? What foods are best for the follicular, ovulatory, luteal, and menstrual phases? Discuss seed cycling.'
  },
  {
    id: 'pcos-1',
    title: 'PCOD & PCOS',
    description: 'This is very common in women, know what happens during PCOD and PCOS',
    imageUrl: '/pcos.jpg', // Healthy lifestyle
    category: 'Conditions',
    fullPrompt: 'What is the difference between PCOD and PCOS? Explain symptoms, causes, and simple lifestyle changes.'
  },
  {
    id: 'mental-health-women',
    title: 'Anxiety & Hormones',
    description: 'Why you might feel anxious before your period and how to cope.',
    imageUrl: 'C.jpg', // Yoga/Peace
    category: 'Wellness',
    fullPrompt: 'Explain the link between hormones (progesterone/estrogen) and anxiety or mood swings in women. Provide coping strategies.'
  },
  {
    id: 'gyno-1',
    title: 'Gynecological Health',
    description: 'Your Gynecology check-ups are just as important as any other.',
    imageUrl: '/gyno.jpg', // Medical/Care
    category: 'Health',
    fullPrompt: 'Why are regular gynecological check-ups important? What happens during a first visit?'
  },
  {
    id: 'skincare-1',
    title: 'Hormonal Acne',
    description: 'Understanding why breakouts happen and how to manage them.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', // Skincare
    category: 'Beauty',
    fullPrompt: 'Why does hormonal acne happen? How can skincare routines change throughout the menstrual cycle?'
  },
  {
    id: 'sleep-1',
    title: 'Sleep Hygiene',
    description: 'Rest is resistance. Improving sleep quality during your cycle.',
    imageUrl: 'sleep.jpeg', // Sleep
    category: 'Lifestyle',
    fullPrompt: 'How does the menstrual cycle affect sleep architecture? Tips for better sleep during the luteal phase.'
  },
  {
    id: 'uti-health',
    title: 'Intimate Hygiene',
    description: 'Best practices for keeping your intimate areas healthy.',
    imageUrl: '/pc.jpg', // Water/Clean
    category: 'Health',
    fullPrompt: 'What are the best practices for vaginal hygiene? Debunk myths about douching and scented products. Discuss preventing UTIs.'
  },
  {
    id: 'contraception-1',
    title: 'Contraception',
    description: 'Empowering yourself with knowledge about birth control options.',
    imageUrl: '/cont1.jpeg', // Pills strip
    category: 'Education',
    fullPrompt: 'Provide a comprehensive overview of contraception methods: Pills, IUDs, Implants, and natural family planning. Discuss pros and cons.'
  }
];

export const FEATURE_ARTICLES: Article[] = [
  {
    id: 'mental-health',
    title: 'Mental Health',
    description: 'It helps determine how we handle stress, relate to others, and make healthy choices.',
    imageUrl: '/mental2.jpg', // Joyful jumping
    category: 'Wellness',
    fullPrompt: 'Discuss the importance of mental health for women, specifically focusing on stress management and self-care.'
  },
  {
    id: 'sex-ed',
    title: 'Sex Education',
    description: 'Sex education aims to teach people how to navigate matters concerning sex, sexuality, and sexual health.',
    imageUrl: 'Z.jpeg', // Connection
    category: 'Education',
    fullPrompt: 'Provide a comprehensive, age-appropriate overview of sex education for young adults, focusing on consent, safety, and pleasure.'
  }
];

export const PERIOD_DETAILS: Article[] = [
  {
    id: 'what-is-period',
    title: 'What are Period?',
    description: 'Periods or menstruation is a natural biological process in which blood and tissue from your uterus come out from your vagina.',
    imageUrl: '/P.jpeg',
    category: 'Menstruation',
    fullPrompt: 'Explain exactly what menstruation is biologically in simple terms.'
  },
  {
    id: 'what-is-pms',
    title: 'What is PMS?',
    description: 'Premenstrual Syndrome is a term used to describe a group of physical and behavioral changes.',
    imageUrl: '/pms.jpg',
    category: 'Menstruation',
    fullPrompt: 'What is PMS? List common physical and emotional symptoms and how to manage them.'
  },
  {
    id: 'cramps',
    title: 'Treating Cramps',
    description: 'During your menstrual period, your uterus contracts to help expel its lining. Hormone like substances trigger pain.',
    imageUrl: '/cramp1.jpeg',
    category: 'Menstruation',
    fullPrompt: 'Give 5 effective home remedies for treating period cramps.'
  },
  {
    id: 'products',
    title: 'Tampons or Pads?',
    description: 'If you’re prone to waking up to sheets that resemble a crime scene, then the biggest pad with wings is probably best.',
    imageUrl: '/tampons.jpg',
    category: 'Hygiene',
    fullPrompt: 'Compare tampons, pads, and menstrual cups. Pros and cons of each.'
  },
  {
    id: 'medical-help',
    title: 'When to see a doctor?',
    description: 'While period pain usually ranges from a dull ache in the belly to painful cramps, how you experience period pains varies.',
    imageUrl: '/doc.jpeg',
    category: 'Health',
    fullPrompt: 'List red flags during a period that indicate a woman should see a doctor immediately.'
  },
  {
    id: 'tracking',
    title: 'Why Track?',
    description: 'If your periods are regular, tracking them will help you know when you ovulate and when to expect your next period.',
    imageUrl: '/calender.jpg',
    category: 'Wellness',
    fullPrompt: 'Why is tracking the menstrual cycle beneficial for health beyond just knowing when the next period is?'
  }
];

export const ADDITIONAL_LIBRARY_ARTICLES: Article[] = [
  {
    id: 'breast-health',
    title: 'Breast Health 101',
    description: 'How to perform self-exams and what changes to look out for.',
    imageUrl: 'pin.jpeg',
    category: 'Body',
    fullPrompt: 'Guide to breast health: How to do a self-exam, what is normal, and when to see a doctor. Discuss breast cancer awareness.'
  },
  {
    id: 'body-image',
    title: 'Body Positivity',
    description: 'Embracing your changing body through every phase of life with kindness.',
    imageUrl: '/body1.jpeg',
    category: 'Wellness',
    fullPrompt: 'Write an article about body neutrality and positivity. How to handle body image issues during bloating or hormonal changes.'
  },
  {
    id: 'safe-sex',
    title: 'Safe Sex Guide',
    description: 'Everything you need to know about protection, consent, and pleasure.',
    imageUrl: '/ss.jpeg',
    category: 'Sex Ed',
    fullPrompt: 'A comprehensive guide to safe sex. Discuss different types of protection against STIs and pregnancy, and emphasize the importance of consent.'
  },
  {
    id: 'discharge-guide',
    title: 'Vaginal Discharge',
    description: 'What is normal? Decoding the colors and consistency of your cycle.',
    imageUrl: '/vag.jpeg',
    category: 'Health',
    fullPrompt: 'Explain the different types of vaginal discharge throughout the menstrual cycle. What colors signify health vs infection?'
  },
  {
    id: 'hair-removal',
    title: 'Body Hair Choices',
    description: 'Shave, wax, or grow? It is completely your choice.',
    imageUrl: '/choice.jpeg',
    category: 'Beauty',
    fullPrompt: 'Discuss body hair removal myths and facts. Emphasize that body hair is natural and removal is a personal choice. Tips for safe shaving/waxing.'
  }
];