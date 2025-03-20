require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const Book = require('./src/books/book.model'); // Ensure path is correct

// Connect to MongoDB using the URL from .env
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Books to seed
const books = [
    {
        "title": "Alice’s Adventures in Wonderland",
        "description": "Follow Alice as she tumbles into a whimsical world filled with peculiar creatures and surreal adventures.",
        "category": "adventure",
        "trending": true,
        "coverImage": "book-17.png",
        "oldPrice": 49.99,
        "newPrice": 39.99,
    },
    {
        "title": "The Picture of Dorian Gray",
        "description": "A young man trades his soul for eternal youth while his hidden portrait reveals the decay of his true self.",
        "category": "horror",
        "trending": true,
        "coverImage": "book-13.png",
        "oldPrice": 26.99,
        "newPrice": 21.99,
    },
    {
        "title": "The First Days",
        "description": "Two women struggle to survive a sudden zombie apocalypse that turns their world upside down.",
        "category": "horror",
        "trending": true,
        "coverImage": "book-7.png",
        "oldPrice": 59.99,
        "newPrice": 49.99,
    },
    {
        "title": "The Lightning Thief",
        "description": "Percy Jackson discovers he is no ordinary boy—he is a demigod, and his adventures are just beginning.",
        "category": "fiction",
        "trending": false,
        "coverImage": "book-16.png",
        "oldPrice": 24.99,
        "newPrice": 19.99,
    },
    {
        "title": "The Giving Tree",
        "description": "A heartwarming tale about a tree that gives everything for the boy it loves over the years.",
        "category": "fiction",
        "trending": false,
        "coverImage": "book-14.png",
        "oldPrice": 34.99,
        "newPrice": 24.99,
    },
    {
        "title": "Pride and Prejudice",
        "description": "Elizabeth Bennet navigates love and societal expectations in this timeless romantic classic.",
        "category": "fiction",
        "trending": true,
        "coverImage": "book-10.png",
        "oldPrice": 14.99,
        "newPrice": 10.99,
    },
    {
        "title": "Ultimate Guide to Digital Marketing",
        "description": "A complete guide covering modern digital marketing strategies and techniques for 2024.",
        "category": "marketing",
        "trending": false,
        "coverImage": "book-6.png",
        "oldPrice": 44.99,
        "newPrice": 34.99,
    },
    {
        "title": "Gone with the Wind",
        "description": "Follow Scarlett O'Hara's journey of survival and love during the Civil War and Reconstruction Era.",
        "category": "fiction",
        "trending": false,
        "coverImage": "book-15.png",
        "oldPrice": 22.99,
        "newPrice": 12.99,
    },
    {
        "title": "The Hunger Games",
        "description": "In a dystopian future, Katniss Everdeen must fight for survival in a brutal televised competition.",
        "category": "fiction",
        "trending": true,
        "coverImage": "book-8.png",
        "oldPrice": 21.99,
        "newPrice": 16.99,
    },
    {
        "title": "Top 10 Fiction Books This Year",
        "description": "A curated list of the most popular and compelling fiction books trending this year.",
        "category": "books",
        "trending": true,
        "coverImage": "book-2.png",
        "oldPrice": 24.99,
        "newPrice": 14.99,
    },
    {
        "title": "The Alchemist",
        "description": "Join Santiago on a mystical journey of self-discovery and the pursuit of his dreams.",
        "category": "adventure",
        "trending": true,
        "coverImage": "book-19.png",
        "oldPrice": 35.99,
        "newPrice": 27.99,
    },
    {
        "title": "How to Grow Your Online Store",
        "description": "Essential strategies and tips to scale your online store in today's competitive marketplace.",
        "category": "business",
        "trending": true,
        "coverImage": "book-1.png",
        "oldPrice": 29.99,
        "newPrice": 19.99,
    },
    {
        "title": "Divergent",
        "description": "Beatrice must choose her future in a society where everyone is divided by their virtues.",
        "category": "business",
        "trending": true,
        "coverImage": "book-18.png",
        "oldPrice": 18.99,
        "newPrice": 12.99,
    },
    {
        "title": "The Fault in Our Stars",
        "description": "A touching story of love and loss as two teenagers face life with terminal illness.",
        "category": "business",
        "trending": true,
        "coverImage": "book-12.png",
        "oldPrice": 19.99,
        "newPrice": 9.99,
    },
    {
        "title": "To Kill a Mockingbird",
        "description": "A powerful story of racial injustice and moral growth in a small Southern town.",
        "category": "fiction",
        "trending": true,
        "coverImage": "book-11.png",
        "oldPrice": 32.99,
        "newPrice": 25.99,
    },
    {
        "title": "Best eCommerce Platforms",
        "description": "A comprehensive guide to choosing the right eCommerce platform for your business.",
        "category": "business",
        "trending": false,
        "coverImage": "book-4.png",
        "oldPrice": 49.99,
        "newPrice": 39.99,
    },
    {
        "title": "Four Thousand Weeks",
        "description": "A practical exploration of time management and making the most of your limited weeks.",
        "category": "business",
        "trending": false,
        "coverImage": "book-20.png",
        "oldPrice": 24.99,
        "newPrice": 14.99,
    },
    {
        "title": "Harry Potter and the Order of the Phoenix",
        "description": "Harry returns to Hogwarts for his fifth year and faces growing threats from the dark forces.",
        "category": "adventure",
        "trending": false,
        "coverImage": "book-9.png",
        "oldPrice": 27.99,
        "newPrice": 18.99,
    },
    {
        "title": "Non-Fiction Reads You Must Try",
        "description": "A handpicked collection of must-read non-fiction books for knowledge seekers.",
        "category": "books",
        "trending": true,
        "coverImage": "book-5.png",
        "oldPrice": 19.99,
        "newPrice": 9.99,
    },
    {
        "title": "Mastering SEO in 2024",
        "description": "Stay ahead with cutting-edge SEO techniques to enhance your online visibility.",
        "category": "marketing",
        "trending": true,
        "coverImage": "book-3.png",
        "oldPrice": 39.99,
        "newPrice": 29.99,
    },
];

// Seed the database
const seedDatabase = async () => {
    try {
        await connectDB();
        await Book.deleteMany({});
        await Book.insertMany(books);
        console.log('📚 Seeded books successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
