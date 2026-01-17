// Pre-built tests for books (no AI needed)
export interface TestQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export const BOOK_TESTS: Record<string, TestQuestion[]> = {
    'book-a': [
        {
            question: "How old was the narrator when he saw the picture of a boa constrictor?",
            options: ["Four years old", "Six years old", "Eight years old", "Ten years old"],
            correctAnswerIndex: 1
        },
        {
            question: "What was the book called that had the picture?",
            options: ["Nature Stories", "True Stories from Nature", "Animal Tales", "Forest Adventures"],
            correctAnswerIndex: 1
        },
        {
            question: "What was the boa constrictor doing in the picture?",
            options: ["Sleeping", "Swimming", "Swallowing an animal", "Climbing a tree"],
            correctAnswerIndex: 2
        },
        {
            question: "What did the grown-ups think the drawing was?",
            options: ["A snake", "An elephant", "A hat", "A box"],
            correctAnswerIndex: 2
        },
        {
            question: "How long do boa constrictors sleep for digestion?",
            options: ["Two months", "Four months", "Six months", "One year"],
            correctAnswerIndex: 2
        },
        {
            question: "Where did the pilot have an accident?",
            options: ["In the mountains", "In the ocean", "In the Desert of Sahara", "In the forest"],
            correctAnswerIndex: 2
        },
        {
            question: "How many days of drinking water did the pilot have?",
            options: ["Three days", "Five days", "Eight days", "Ten days"],
            correctAnswerIndex: 2
        },
        {
            question: "What did the strange little voice ask the pilot to draw?",
            options: ["A flower", "A sheep", "A star", "A house"],
            correctAnswerIndex: 1
        },
        {
            question: "Why was the first sheep drawing rejected?",
            options: ["It was too big", "It was too small", "It was sick", "It had no ears"],
            correctAnswerIndex: 2
        },
        {
            question: "What was the name of the little prince's planet?",
            options: ["Asteroid B-612", "Planet X-100", "Star C-45", "Moon D-99"],
            correctAnswerIndex: 0
        }
    ],
    'book-b': [
        {
            question: "What is the main character's name?",
            options: ["Peter", "James", "Oliver", "William"],
            correctAnswerIndex: 2
        },
        {
            question: "Where does the story take place?",
            options: ["London", "Paris", "New York", "Berlin"],
            correctAnswerIndex: 0
        },
        {
            question: "What does Oliver ask for more of?",
            options: ["Water", "Bread", "Gruel", "Meat"],
            correctAnswerIndex: 2
        },
        {
            question: "How does Oliver feel in the workhouse?",
            options: ["Happy", "Hungry", "Excited", "Sleepy"],
            correctAnswerIndex: 1
        },
        {
            question: "What word means 'very hungry'?",
            options: ["Full", "Starving", "Tired", "Cold"],
            correctAnswerIndex: 1
        },
        {
            question: "Where does Oliver live at the beginning?",
            options: ["A palace", "A workhouse", "A farm", "A castle"],
            correctAnswerIndex: 1
        },
        {
            question: "What does 'orphan' mean?",
            options: ["A child with parents", "A child without parents", "A happy child", "A rich child"],
            correctAnswerIndex: 1
        },
        {
            question: "How old is Oliver?",
            options: ["Five", "Seven", "Nine", "Eleven"],
            correctAnswerIndex: 2
        },
        {
            question: "What is the opposite of 'hungry'?",
            options: ["Tired", "Full", "Sad", "Angry"],
            correctAnswerIndex: 1
        },
        {
            question: "What does Oliver want from life?",
            options: ["Money", "A family", "Power", "Fame"],
            correctAnswerIndex: 1
        }
    ],
    'book-c': [
        {
            question: "Who wrote 'The Great Gatsby'?",
            options: ["Ernest Hemingway", "F. Scott Fitzgerald", "Mark Twain", "John Steinbeck"],
            correctAnswerIndex: 1
        },
        {
            question: "Where does Gatsby live?",
            options: ["East Egg", "West Egg", "New York City", "Chicago"],
            correctAnswerIndex: 1
        },
        {
            question: "What color is often associated with Gatsby's dreams?",
            options: ["Red", "Blue", "Green", "Yellow"],
            correctAnswerIndex: 2
        },
        {
            question: "Who is the narrator of the story?",
            options: ["Gatsby", "Daisy", "Nick Carraway", "Tom Buchanan"],
            correctAnswerIndex: 2
        },
        {
            question: "What is Gatsby famous for?",
            options: ["His books", "His parties", "His cars", "His art"],
            correctAnswerIndex: 1
        },
        {
            question: "What does 'wealthy' mean?",
            options: ["Poor", "Rich", "Sad", "Young"],
            correctAnswerIndex: 1
        },
        {
            question: "Who is Daisy?",
            options: ["Gatsby's sister", "Nick's cousin", "Tom's mother", "A maid"],
            correctAnswerIndex: 1
        },
        {
            question: "What decade does the story take place in?",
            options: ["1900s", "1910s", "1920s", "1930s"],
            correctAnswerIndex: 2
        },
        {
            question: "What is the opposite of 'wealthy'?",
            options: ["Rich", "Happy", "Poor", "Smart"],
            correctAnswerIndex: 2
        },
        {
            question: "What does Gatsby want?",
            options: ["More money", "To be president", "To reunite with Daisy", "To travel"],
            correctAnswerIndex: 2
        }
    ],
    'book-d': [
        {
            question: "What is the main theme of the story?",
            options: ["Adventure", "Friendship", "Love", "Mystery"],
            correctAnswerIndex: 1
        },
        {
            question: "Where does the story begin?",
            options: ["A school", "A forest", "A city", "A beach"],
            correctAnswerIndex: 0
        },
        {
            question: "How many main characters are there?",
            options: ["One", "Two", "Three", "Four"],
            correctAnswerIndex: 2
        },
        {
            question: "What is the setting of the story?",
            options: ["Winter", "Summer", "Spring", "Autumn"],
            correctAnswerIndex: 1
        },
        {
            question: "What word means 'very happy'?",
            options: ["Sad", "Angry", "Joyful", "Tired"],
            correctAnswerIndex: 2
        },
        {
            question: "Who is the protagonist?",
            options: ["The teacher", "A student", "A parent", "An animal"],
            correctAnswerIndex: 1
        },
        {
            question: "What does 'adventure' mean?",
            options: ["Boring activity", "Exciting journey", "Sad story", "Long sleep"],
            correctAnswerIndex: 1
        },
        {
            question: "What is the mood of the story?",
            options: ["Dark", "Happy", "Scary", "Boring"],
            correctAnswerIndex: 1
        },
        {
            question: "What is the opposite of 'beginning'?",
            options: ["Start", "Middle", "End", "First"],
            correctAnswerIndex: 2
        },
        {
            question: "What lesson does the story teach?",
            options: ["Be selfish", "Be kind to others", "Be lazy", "Be angry"],
            correctAnswerIndex: 1
        }
    ],
    'book-e': [
        {
            question: "What genre is this book?",
            options: ["Comedy", "Drama", "Mystery", "Romance"],
            correctAnswerIndex: 2
        },
        {
            question: "Who solves the mystery?",
            options: ["A child", "A detective", "A teacher", "A doctor"],
            correctAnswerIndex: 1
        },
        {
            question: "What is missing in the story?",
            options: ["A person", "An object", "Money", "A pet"],
            correctAnswerIndex: 1
        },
        {
            question: "Where does most of the action happen?",
            options: ["A house", "A school", "A park", "A museum"],
            correctAnswerIndex: 0
        },
        {
            question: "What word means 'to look for something'?",
            options: ["Run", "Search", "Sleep", "Eat"],
            correctAnswerIndex: 1
        },
        {
            question: "What is a 'clue'?",
            options: ["A type of food", "A hint to solve a mystery", "A kind of animal", "A sort of plant"],
            correctAnswerIndex: 1
        },
        {
            question: "How does the story end?",
            options: ["Sadly", "The mystery is solved", "Nobody knows", "It continues"],
            correctAnswerIndex: 1
        },
        {
            question: "What does 'investigate' mean?",
            options: ["To ignore", "To examine carefully", "To run away", "To sleep"],
            correctAnswerIndex: 1
        },
        {
            question: "Who is the main suspect?",
            options: ["The neighbor", "The friend", "The stranger", "No one"],
            correctAnswerIndex: 2
        },
        {
            question: "What is the opposite of 'guilty'?",
            options: ["Bad", "Innocent", "Sad", "Happy"],
            correctAnswerIndex: 1
        }
    ],
    'book-f': [
        {
            question: "What is the theme of this story?",
            options: ["War", "Nature", "Technology", "Science"],
            correctAnswerIndex: 1
        },
        {
            question: "What type of book is this?",
            options: ["Fiction", "Non-fiction", "Poetry", "Drama"],
            correctAnswerIndex: 0
        },
        {
            question: "Where does the story take place?",
            options: ["A city", "A village", "Nature", "Space"],
            correctAnswerIndex: 2
        },
        {
            question: "What is the main character's goal?",
            options: ["To survive", "To become rich", "To find love", "To learn"],
            correctAnswerIndex: 3
        },
        {
            question: "What does 'nature' include?",
            options: ["Only trees", "Animals and plants", "Only water", "Only rocks"],
            correctAnswerIndex: 1
        },
        {
            question: "What season is featured in the story?",
            options: ["Only winter", "Only summer", "All seasons", "No seasons"],
            correctAnswerIndex: 2
        },
        {
            question: "What is an 'ecosystem'?",
            options: ["A type of car", "Living things and their environment", "A building", "A game"],
            correctAnswerIndex: 1
        },
        {
            question: "What message does the story give?",
            options: ["Destroy nature", "Protect nature", "Ignore nature", "Fear nature"],
            correctAnswerIndex: 1
        },
        {
            question: "What does 'environment' mean?",
            options: ["A house", "Surroundings", "A book", "A person"],
            correctAnswerIndex: 1
        },
        {
            question: "What is the opposite of 'wild'?",
            options: ["Crazy", "Tame", "Fast", "Slow"],
            correctAnswerIndex: 1
        }
    ]
};

// Get test for a specific book
export function getBookTest(bookId: string): TestQuestion[] {
    return BOOK_TESTS[bookId] || BOOK_TESTS['book-a'];
}
