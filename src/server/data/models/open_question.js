import async from 'async'
import Models from '../../models/models'
import addArray from '../utils/add_array'
import {OpenQuestion} from '../../models/models'

const questions =
    ["Why is processing a sorted array faster than an unsorted array?", "How do you undo the last commit?",
        "Edit an incorrect commit message in Git", "Delete a Git branch both locally and remotely",
        "What is the correct JSON content type?", "What are the differences between 'git pull' and 'git fetch'?",
        "How do JavaScript closures work?", "What is the name of the �--&gt;� operator?", "What and where are the stack and heap?",
        "How can I make a redirect page using jQuery?", "The Definitive C++ Book Guide and List",
        "What does the yield keyword do in Python?", "Undo 'git add' before commit",
        "What does �use strict� do in JavaScript, and what is the reasoning behind it?", "Checking if an element is hidden",
        "How can I check if one string contains another substring?","Why is subtracting these two times (in 1927) giving a strange result?",
        "How do I correctly pass the string �Null� (an employee's proper surname) to a SOAP web service from ActionScript 3?",
        "The definitive guide to form-based website authentication", "var functionName = function() {} vs function functionName() {}",
        "Why does HTML think �chucknorris� is a color?", "Does it matter which equals operator (== vs ===) I use in JavaScript comparisons?",
        "How do you rename the local branch?", "Plain English explanation of Big O", "How do I remove local (untracked) files from my current Git branch?",
        "Difference between px, dp, dip and sp in Android?", "What's the difference between String and string?", "Revert Git repo to a previous commit",
        "How can I prevent SQL-injection in PHP?", "Can I use comments inside a JSON file?",
        "How can I get query string values in JavaScript?", "Fix merge conflicts in Git?",
        "Is Java �pass-by-reference� or �pass-by-value�?", "CSS rule to disable text selection highlighting",
        "Pair socks from a pile efficiently?", "What is the maximum length of a URL in different browsers?",
        "What is a metaclass in Python?", "Href attribute for JavaScript links: �#� or �javascript:void(0)�?",
        "PUT vs POST in REST", "What is the most efficient way to clone an object?", "Checkout remote Git branch",
        "Clone all remote branches with Git?", "Flash CS4 refuses to let go", "Force Git to overwrite local files on pull",
        "Difference between INNER and OUTER joins","How to remove a property from a JavaScript object", "Java += operator",
        "Include a JavaScript file in another JavaScript file?", "Check checkbox checked property", "Checking a checkbox with jQuery?",
        "Can a Bash script tell what directory it's stored in?", "Avoiding != null statements",
        "Remove a particular element from an array in JavaScript?", "Change an input's HTML5 placeholder color with CSS",
        "Why is the Android emulator so slow? How can we speed up the Android emulator?", "Reference - What does this symbol mean in PHP?",
        "How do I remove a Git submodule?", "What is the difference between a URI, a URL and a URN",
        "Check whether a file exists using Python", "Make an existing Git branch track a remote branch?",
        "For-each over an array in JavaScript?", "How do you get a timestamp in JavaScript?",
        "Using a regular expression to validate an email address", "Horizontally center a div in a div",
        "Proper use cases for Android UserManager.isUserAGoat()?", "How can I add an empty directory to a Git repository?",
        "Why does Google prepend while(1); to their JSON responses?", "Regular expression to match line that doesn't contain a word?",
        "Set cellpadding and cellspacing in CSS?", "How do you discard unstaged changes in Git?",
        "AngularJS : Service vs provider vs factory", "Does Python have a ternary conditional operator?",
        "Differences between HashMap and Hashtable?", "How do I enumerate an enum?", "Read/convert an InputStream to a String",
        "View the change history of a file using Git versioning", "�Debug certificate expired� error in Eclipse Android plugins",
        "How can I pretty-print JSON?", "What is dependency injection?", "Encode URL in JavaScript?",
        "Grep a file, but show several surrounding lines?", "Is it possible to apply CSS to half of a character?",
        "Case insensitive 'Contains(string)'", "Indent multiple lines quickly in vi",
        "What are the differences between a pointer variable and a reference variable in C++?",
        "Daylight saving time and time zone best practices", "How can I merge two Python dictionaries in a single expression?",
        "How to give text or an image a transparent background using CSS?", "Add table row in jQuery",
        "Ignore files that have already been committed to a Git repository",
        "Do a �git export� (like �svn export�)?", "Iterate through a HashMap [duplicate]", "How do you create a remote Git branch?",
        "Change the URI (URL) for a remote Git repository", "Reset or revert a specific file to a specific revision using Git?",
        "Create ArrayList from array", "Validate email address in JavaScript?", "Validate decimal numbers in JavaScript - IsNumeric()",
        "UPDATE from SELECT using SQL Server", "Split a string in C++?", "Creating a memory leak with Java [closed]",
        "Detecting an undefined object property", "Improve INSERT-per-second performance of SQLite?",
        "How do I return the response from an asynchronous call?", "Generating random integers in a range with Java",
        "$(this) selector and children?", "Capitalize the first letter of string in JavaScript",
        "Delete commits from a branch in Git", "When to use LinkedList over ArrayList?",
        "Why is printing �B� dramatically slower than printing �#�?", "What does `if __name__ == �__main__�:` do?",
        "Should I use field 'datetime' or 'timestamp'?", "How do I copy to the clipboard in JavaScript?",
        "What is a serialVersionUID and why should I use it?", "Appending to array", "Cast int to enum in C#",
        "Find and restore a deleted file in a Git repository", "Get current URL in web browser", "Vertically align text within a UILabel",
        "Why doesn't GCC optimize a*a*a*a*a*a to (a*a*a)*(a*a*a)?","View the change history of a file using Git versioning",
        "�Debug certificate expired� error in Eclipse Android plugins", "How can I pretty-print JSON?", "What is dependency injection?",
        "Encode URL in JavaScript?", "Grep a file, but show several surrounding lines?",
        "Is it possible to apply CSS to half of a character?", "Case insensitive 'Contains(string)'",
        "Indent multiple lines quickly in vi", "What are the differences between a pointer variable and a reference variable in C++?",
        "Daylight saving time and time zone best practices", "How can I merge two Python dictionaries in a single expression?",
        "How to give text or an image a transparent background using CSS?", "Add table row in jQuery",
        "Ignore files that have already been committed to a Git repository",  "How can I know which radio button is selected via jQuery?",
        "How to install pip on Windows?", "RegEx match open tags except XHTML self-contained tags",
        "What is the optimal algorithm for the game 2048?", "Sort a Python dictionary by value",
        "Why is one loop so much slower than two loops?", "What does the explicit keyword in C++ mean?",
        "How do I find Waldo with Mathematica?", ".prop() vs .attr()",
        "Add a column, with a default value, to an existing table in SQL Server", "Saving Activity state on Android",
        "Difference between �git add -A� and �git add .�", "Is there a CSS parent selector?", "Change an element's class with JavaScript",
        "Is there an �exists� function for jQuery?","Converting String to Int in Java?",
        "Replacing all occurrences of a string in JavaScript", "Converting a string to byte-array without using an encoding (byte-by-byte)",
        "Remove a file from a Git repository without deleting it from the local filesystem", "How do I empty an array in JavaScript?",
        "Stop EditText from gaining focus at Activity startup", "How do you parse and process HTML/XML in PHP?",
        "How do I get started with Node.js", "Using global variables in a function other than the one that created them",
        "How do you disable browser Autocomplete on web form field / input tag?", "How does JavaScript .prototype work?",
        "In Python, check if a directory exists and create it if necessary",
        "What's the difference between the atomic and nonatomic attributes?",
        "Format a Microsoft JSON date?", "Move existing, uncommited work to a new branch in Git",
        "In Java, what's the difference between public, default, protected, and private?", "How can I write a switch statement in Ruby?",
        "How to �add existing frameworks� in Xcode 4?", "Change the author of a commit in Git",
        "Detach subdirectory into separate Git repository", "Undoing a git rebase", "How do I tell if a regular file does not exist in bash?",
        "Check if string contains specific words?", "Warning: push.default is unset; its implicit value is changing in Git 2.0",
        "Is there a unique Android device ID?", "What is the difference between @staticmethod and @classmethod in Python?",
        "When to use self vs $this?", "�Least Astonishment� in Python: The Mutable Default Argument", "What is JSONP all about?",
        "How to test a class that has private methods, fields or inner classes",
        "Loop through array in JavaScript", "Commit only part of a file in Git", "Best way to check if a list is empty",
        "Operator overloading", "How is Docker different from a normal virtual machine?",
        "How do you check for an empty string in JavaScript?", "List all the files for a commit in Git",
        "When should static_cast, dynamic_cast, const_cast and reinterpret_cast be used?",
        "What are MVP and MVC and what is the difference?", "Using Git with Visual Studio [closed]",
        "How can I represent an 'Enum' in Python?", "Using java.net.URLConnection to fire and handle HTTP requests",
        "Showing which files have changed between two revisions", "What are the correct version numbers for C#?",
        "Storing Objects in HTML5 localStorage",
        "Get selected text from a drop-down list (select box) using jQuery", "Lazy load of images in ListView",
        "How do I make Git ignore file mode (chmod) changes?", "How to update a GitHub forked repository?",
        "When to use margin vs padding in CSS", "How do I pass a variable by reference?",
        "How can I select an element with multiple classes?", "Iterate over each Entry in a Map",
        "Why shouldn't I use mysql_* functions in PHP?", "Disable/enable an input with jQuery?",
        "Difference between Decimal, Float and Double in .NET?", "What is The Rule of Three?", "Is there a way to run Python on Android?",
        "Stash only one file out of multiple files that have changed with Git?", "How to make a great R reproducible example?",
        "How does Facebook disable the browser's integrated Developer Tools?", "Checking if a key exists in a JavaScript object?",
        "How do I get a YouTube video thumbnail from the YouTube API?", "Set a default parameter value for a JavaScript function",
        "How do you set, clear and toggle a single bit in C/C++?", "How do I calculate someone's age in C#?",
        "Get screen dimensions in pixels", "How can I refresh a page with jQuery?", "Vertically align text next to an image?",
        "Python - append vs. extend", "Accessing the index in Python for loops", "What is the 'new' keyword in JavaScript?",
        "Why does this code using random strings print �hello world�?", "Deep cloning objects", "How do CSS triangles work?",
        "Should 'using' statements be inside or outside the namespace?",
        "Understanding Python super() with __init__() methods [duplicate]", "How can I disable ARC for a single file in a project?",
        "How can I create an executable JAR with dependencies using Maven?", "What is so bad about singletons? [closed]",
        "Is there a reason for C#'s reuse of the variable in a foreach?", "How to check if a string �StartsWith� another string?",
        "Abort Ajax requests using jQuery", "Does Python have a string contains substring method?",
        "Most elegant way to clone a JavaScript object", "android.os.NetworkOnMainThreadException",
        "How should I ethically approach user password storage for later plaintext retrieval?", "What IDE to use for Python?",
        "What is the !! (not not) operator in JavaScript?", "How to detect a click outside an element?",
        "Difference between __str__ and __repr__ in Python", "Making git �forget� about a file that was tracked but is now in .gitignore",
        "Text editor to open big (giant, huge, large) text files [closed]", "JavaScript equivalent to printf/string.format",
        "What are valid values for the id attribute in HTML?", "What does the C ??!??! operator do?", "Do I cast the result of malloc?",
        "How to align checkboxes and their labels consistently cross-browsers", "AngularJS : How does databinding work?",
        "How can I determine the URL that a local Git repository was originally cloned from?",
        "How can I test if an array contains a certain value?", "Is there an equivalent of 'which' on the Windows command line?",
        "Why does changing 0.1f to 0 slow down performance by 10x?", "What is the scope of variables in JavaScript?",
        "What is the copy-and-swap idiom?","How to avoid Java code in JSP files?", "With C arrays, why is it the case that a[5] == 5[a]?",
        "Determine installed PowerShell version", "JavaScript closure inside loops � simple practical example",
        "Regular cast vs. static_cast vs. dynamic_cast [duplicate]", "What can I use to profile C++ code in Linux? [closed]",
        "Catch multiple exceptions at once?", "How to list all files of a directory in Python",
        "How do I commit all deleted files in Git? [duplicate]", "Trim string in JavaScript?", "Get current URL in JavaScript?",
        "jQuery scroll to element", "Delete an element from an array", "Download a specific tag with Git",
        "How to migrate SVN repository with history to a new Git repository?"]

const answers =
    ["Yes, players who don't want to buy things from the Dota 2 Store will be able to earn them in a variety of ways, such as by simply playing the game, increasing their Battle Level, or by trading with other players.", "All of the heroes will be available free of charge. We believe restricting player access to heroes could be destructive to game design, so it's something we plan to avoid.", "Each time you complete a matchmaking game, you will be rewarded with Battle Points. Earn enough of them, and your profile's Battle Level will increase, at which point you'll receive a new item.", "We're acutely aware of the community's concerns around remaining true to the theme of the game, so much so that we think the community should be directly involved in the process of choosing what goes into it. The Steam Workshop allows you to submit your votes and thoughts on contributed items before we make any decision to put them into the game, so jump in and help us stay on the right track. We think the community at large is actually really good at making these kinds of decisions.",
        "All the items in the store are cosmetic, and don't affect gameplay. In addition, we have plans for how the Dota economy can directly contribute to professional players.", "We don't really think of Dota 2 as a beta, but we also aren't ready for everyone to show up and start playing just yet. We are constantly updating the game with new heroes, bug fixes, and new features. None of the items you purchase or the progress you make will be lost or reset once the game is available for everyone.", "We think it fits the way we build and iterate on our games over time. We (Valve and the Dota community) will be building lots of interesting things in the coming years, and learning every step of the way. The more people we have generating ideas and providing feedback, the better Dota will become.", "We've still got work to do before we can support the number of players who've shown interest in Dota 2. Right now we're working on expanding our server infrastructure, which is the primary bottleneck.", "Similar to how we're approaching the problem of players leaving games early, we have a number of ideas to experiment with to prevent players making life hard for new players in this way. We know this is one of the big challenges we have to solve with a Free to Play game.",
        "Lots of players improve from one season to the next and the purpose of the seasonal reset is to give players a fresh start. Additionally, each season comes with a new set of design changes and players that adapt the best tend to rise to the top. The reset helps distinguish between who can keep up and who can�t.","You�ll play 10 placement matches and, at the end, be seeded into a league and tier.", "Seeding is what happens after your 10th game of the season. Based on a combination of your performance during placement matches and your performance from previous seasons, you�ll be placed in a league and tier. That�s your starting point for the season, but you can climb the ladder quickly by consistently winning games.", "We use some fancy math and statistics to take your progress from previous seasons into account when you�re placed, but you�ll likely be seeded into a different tier or division than the previous season.",
        "Most players will be placed close to where they were in the previous season, but some will be placed lower (or higher) than in the previous season based on their game history. For example, a player who was division V and lost a lot of games at 0 LP last season will see those losses reflected in their placement this season. If a player is placed into a league below their skill level and they start winning, they�ll see accelerated gains / division skipping as the system quickly pushes them to their correct league position.","If you�re just starting ranked play, you�ll be placed at what�s considered the league average. Your performance in your placement matches will determine your standing in relation to other ranked players and, after 10 games, you�ll be seeded to that position for the ranked season.", "The League Championship Series is a professional sports league, with players who compete for most of the year, live with their teams and travel extensively. All this adds up to a full-time job and commitment that requires significant sacrifice and lot of maturity. That�s why we believe that 17 is the appropriate minimum age for a pro player.",
        "We�ve partnered with Coke Zero to create a brand new league to support future League pros! During the 2014 Season, the top 20 Challenger teams will go head-to-head in a special Challenger Series that�ll qualify them for a shot at the LCS. This is now the only way for new teams to compete in the LCS.","We�ll broadcast all the Challenger Series action (except the play-in stages) on lolesports.com. Matches will air immediately after each region�s LCS broadcast.", "According to your job requirements, I have done many projects like yours. For more details you can check my portfolio, profiles and employment history where you will find the similar projects like your desire one.", "Sure I have suggestions for you in this project. According to my concept, the updated strategy and proper methods can make this project successful. And surely I will make this project successful.", "According to your job details, I have years of experiences in both fields. And I always use the updated techniques and win the competition. I have a strong belief that I would be able to make this project successful within short time.",
        "Yes I have taken oDesk/Upwork Skill Tests and I have done well. You can check my tests area. Default system of odesk/Upwork tests is a good method of justify oneself. And yes I appreciate it as well as I did well in here.", "Competition is everywhere. Always want to be ranked in google. But failing in this competition is problematic. And I know this problem. The problem is the so called workers do not use the updated methods where I always hit the iron when it is hot. That�s why I can assure you that I will be able to do it in short times than the rest (2+ or 3+ months)", "Here the two parts of this project appeal me very much, one is that all the requirements are in favor of me and the second one is I like to do these kind of job. These kind of project and job give me mental satisfaction.", "I think I am a good fit for this job because I have all the qualities that you are looking for. Experience is the golden factor in this project where you find in me at least 3+ years of working experiences over all the factors in your project.", "Your arrangement of the job description is fully understandable and I have understood it very well. Still I have no questions about your job description. If I need any information latter, I must convey you and discuss with you in a friendly circumstances.",
        "Ans: I have carefully read your job description and I have more than 3 years of working experience in both of your required skills. And I am strongest at all of your required qualities. Hope I will be the perfect worker for you in this project.", "I have successfully completed many seo projects before, you can see my employment history and portfolio projects. I hope I will also be successful in this project. You can undoubtedly hire me.", "I have a strong belief that I would be able to make this project successful within short time. I will spend my time working on this project hourly with white hat updated method and make it successful.", "Sure I have done high PR back-inkling before and ranked many sites. You can check my employment history and portfolio. (You can also include some links here)", "This is a good point you have asked. Here you will found many so called worker who do not know how to work. I am totally different from them. I have a long term plan to work in here, that�s why I am here with all qualities and experiences. I am here not to cheat you rather help you.",
        "Everything is now becoming challenging, If one has to win he or she should have the proper knowledge of the present situation. And I am most experienced in this factor. Hope I will make your project successful.", "I have successfully completed many projects. You can see my portfolio and employment history. And I took the relevant cost, I never ask for high price.", "Ranking a website on some certain keywords are now very difficult. But if one has relevant ideas and skills about the search engines� logarithm, he/she must win this competition. According to that I will first make your site search engine friendly then I will make it popular to others and increase its rank.", "Ans: I have applied to this particular job because all the requirements of this project are in favor of me and I can 100% assure you that I must be successful in this project and satisfy you. I never apply to any job what doesn�t match my skills.",
        "Ans: Great question. I never take any attempt without having the full knowledge of a matter. I have carefully read the job description and only then I decided to apply when I thought; I am the best one for this project. You can undoubtedly hire me.", "I have read the whole job description and it is really informative. I did not found anything that is irrelevant to me. I have understood every single part of the job description. Still I have not any question about the project. If I need any further help, I must ask you.", "This is a good question, my dear client. And yes, I have a lot of previous experiences. For more on it please check my profile, work history and feedback. I have also added some portfolio that is more relevant to your question. Thanks a lot.", "Yes, really a good question. You have seen many freelancers have applied in this project but the best one for this project should be the person who has previous experiences for the relevant skills. And I have both experiences and skills. That�s why I can proudly assure you that I will be the best one among the all workers.", "Yes, I can read and understand English to a reasonable standard. Although English is my second language, I practiced it well and now I am able to fully read, write, listen and speak in English. Hope our conversation will go well during the project.",
        "Ans: Yes, really this is a good question. You have seen many freelancers have applied in this project but the best one for this project should be the person who has previous experiences for the relevant skills. And I have both experiences and skills. That�s why I can proudly assure you that I will be the best one among the all workers. Hope you have got your answers that why you should hire me?","To use our schema definition, we need to convert our blogSchema into a Model we can work with. To do so, we pass it into mongoose.model(modelName, schema)","Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods too.","MongoDB supports secondary indexes. With mongoose, we define these indexes within our Schema at the path level or the schema level. Defining indexes at the schema level is necessary when creating compound indexes.",
        "When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema. Mongoose will call ensureIndex for each index sequentially, and emit an 'index' event on the model when all the ensureIndex calls succeeded or when there was an error. While nice for development, it is recommended this behavior be disabled in production since index creation can cause a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false, or globally on the connection by setting the option config.autoIndex to false.","Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.","Mongoose lets you do this as well through its virtual property setters","Schemas have a few configurable options which can be passed to the constructor or set directly",
        "When running with the drivers autoReconnect option disabled and connected to a single mongod (non-replica-set), mongoose buffers commands when the connection goes down until you manually reconnect. To disable mongoose buffering under these conditions, set this option to false.","Mongoose supports MongoDBs capped collections. To specify the underlying MongoDB collection be capped, set the capped option to the maximum size of the collection in bytes.","The capped option may also be set to an object if you want to pass additional options like max or autoIndexId. In this case you must explicitly pass the size option which is required.", "Mongoose by default produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. Set this option if you need a different name for your collection.", "By default, mongoose will build any indexes you specify in your schema for you, and emit an 'index' event on the model when the index build either succeeds or errors out.",
        "Node.js' built-in event emitter throws an exception if an error event is emitted and there are no listeners, so its easy to configure your application to fail fast when an index build fails.", "Mongoose assigns each of your schemas an id virtual getter by default which returns the documents _id field cast to a string, or in the case of ObjectIds, its hexString. If you don't want an id getter added to your schema, you may disable it passing this option at schema construction time.", "Mongoose assigns each of your schemas an _id field by default if one is not passed into the Schema constructor. The type assigned is an ObjectId to coincide with MongoDBs default behavior. If you don't want an _id added to your schema at all, you may disable it using this option.", "Mongoose will, by default, minimize schemas by removing empty objects.", "This behavior can be overridden by setting minimize option to false. It will then store empty objects.", "Allows setting query#read options at the schema level, providing us a way to apply default ReadPreferences to all queries derived from a model.",
        "This option is passed to MongoDB with all operations and specifies if errors should be returned to our callbacks as well as tune write behavior.", "By default this is set to true for all schemas which guarentees that any occurring error gets passed back to our callback. By setting safe to something else like { j: 1, w: 2, wtimeout: 10000 } we can guarantee the write was committed to the MongoDB journal (j: 1), at least 2 replicas (w: 2), and that the write will timeout if it takes longer than 10 seconds (wtimeout: 10000). Errors will still be passed to our callback.", "The shardKey option is used when we have a sharded MongoDB architecture. Each sharded collection is given a shard key which must be present in all insert/update operations. We just need to set this schema option to the same shard key and we�ll be all set.", "The strict option, (enabled by default), ensures that values passed to our model constructor that were not specified in our schema do not get saved to the db.", "Documents have a toObject method which converts the mongoose document into a plain javascript object. This method accepts a few options. Instead of applying these options on a per-document basis we may declare the options here and have it applied to all of this schemas documents by default.",
        "By default, if you have an object with key 'type' in your schema, mongoose will interpret it as a type declaration.", "By default, documents are automatically validated before they are saved to the database. This is to prevent saving an invalid document. If you want to handle validation manually, and be able to save objects which don't pass validation, you can set validateBeforeSave to false.", "The versionKey is a property set on each document when first created by Mongoose. This keys value contains the internal revision of the document. The name of this document property is configurable.", "Document versioning can also be disabled by setting the versionKey to false.", "By default, the name of two fields are createdAt and updatedAt, custom the field name by setting timestamps.createdAt and timestamps.updatedAt.", "Schemas are also pluggable which allows us to package up reusable features into plugins that can be shared with the community or just between your projects.", "SchemaTypes handle definition of path defaults, validation, getters, setters, field selection defaults for queries and other general characteristics for Strings and Numbers.","To specify a type of ObjectId, use Schema.Types.ObjectId in your declaration.",
        "Models are fancy constructors compiled from our Schema definitions. Instances of these models represent documents which can be saved and retrieved from our database. All document creation and retrieval from the database is handled by these models.", "Finding documents is easy with Mongoose, which supports the rich query syntax of MongoDB. Documents can be retreived using each models find, findById, findOne, or where static methods.","Models have a static remove method available for removing all documents matching conditions.", "Each model has its own update method for modifying documents in the database without returning them to your application. See the API docs for more detail.", "If you want to update a single document in the db and return it to your application, use findOneAndUpdate instead.", "Mongoose documents represent a one-to-one mapping to documents as stored in MongoDB. Each document is an instance of its Model.", "There are many ways to retrieve documents from MongoDB. We won't cover that in this section. See the chapter on querying for detail.",
        "Documents are validated before they are saved. Read the api docs or the validation chapter for detail.", "Sub-documents enjoy all the same features as normal documents. The only difference is that they are not saved individually, they are saved whenever their top-level parent document is saved.", "If an error occurs in a sub-documents' middleware, it is bubbled up to the save() callback of the parent, so error handling is a snap!", "Each document has an _id. DocumentArrays have a special id method for looking up a document by its _id.", "Sub-docs may also be created without adding them to the array by using the create method of MongooseArrays.", "You can also embed schemas without using arrays.", "A single embedded sub-document behaves similarly to an embedded array. It only gets saved when the parent document gets saved, and its pre/post document middleware get executed.", "When executing a query with a callback function, you specify your query as a JSON document. The JSON document's syntax is the same as the MongoDB shell.",
        "In the above code, the query variable is of type Query. A Query enables you to build up a query using chaining syntax, rather than specifying a JSON object. The below 2 examples are equivalent.", "Queries can be streamed from MongoDB to your application as well. Simply call the query's stream method instead of exec to return an instance of QueryStream. Note: QueryStreams are Node.js 0.8 style read streams not Node.js 0.10 style.","If the built-in validators aren't enough, validation can be completely tailored to suite your needs.", "Mongoose documents also have a validateSync() function, which returns a ValidationError if there was an error, or falsy if there was no error. Note that validateSync() only executes synchronous validators. Custom asynchronous validators won't execute.", "In the above examples, you learned about document validation. Mongoose also supports validation for update() and findOneAndUpdate() operations. In Mongoose 4.x, update validators are off by default - you need to specify the runValidators option.", "There are a couple of key differences between update validators and document validators. In the color validation function above, this refers to the document being validated when using document validation.",
        "When using update validators, required validators only fail when you try to explicitly $unset the key.", "Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins. Mongoose 4.0 has 2 types of middleware: document middleware and query middleware", "There are two types of pre hooks, serial and parallel.", "If any middleware calls next or done with an error, the flow is interrupted, and the error is passed to the callback.","Query middleware differs from document middleware in a subtle but important way: in document middleware, this refers to the document being updated. In query middleware, mongoose doesn't necessarily have a reference to the document being updated, so this refers to the query object rather than the document being updated.","There are no joins in MongoDB but sometimes we still want references to documents in other collections. This is where population comes in.", "Populated paths are no longer set to their original _id , their value is replaced with the mongoose document returned from the database by performing a separate query before returning the results.",
        "The connect method also accepts an options object which will be passed on to the underlying driver. All options included here take precedence over options passed in the connection string.", "Each connection, whether created with mongoose.connect or mongoose.createConnection are all backed by an internal configurable connection pool defaulting to a size of 5.", "Schemas are pluggable, that is, they allow for applying pre-packaged capabilities to extend their functionality.", "We just added last-modified behavior to both our Game and Player schemas and declared an index on the lastMod path of our Games to boot. Not bad for a few lines of code.", "Mongoose async operations, like .save() and queries, return Promises/A+ conformant promises.", "Mongoose queries are not promises. However, they do have a .then() function for yield and async/await. If you need a fully-fledged promise, use the .exec() function."]

export default {
    generate: cb => {
        const data = questions.map((question, index) => {
            return {question, answer: answers[index%question.length], free: Math.round(Math.random())}
        })
        addArray(OpenQuestion, data, err => cb())
    },
    answers, questions
}