BEGIN;

TRUNCATE 
    recommend_comments,
    recommend_requests,
    recommend_users RESTART IDENTITY CASCADE;

INSERT INTO recommend_users (first_name,last_name,email,password)
VALUES
    ('Test','User','test@gmail.com','$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
    ('Jessica','Yip','jessicayip@gmail.com','$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
    ('Steph','Winter','steph@gmail.com','$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
    ('Jane','Doe','jane@gmail.com','$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
    ('John','Poe','john@gmail.com','$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne');

INSERT INTO recommend_requests (user_id, product, category, info, date)
VALUES
    (1,'Running Shoes','Clothing & Shoes','I run about 20 miles per week, mostly on concrete. I have very bad knees, so I need lots of padding. My budget is $50.','2020-03-04T00:00:00.000Z'),
    (2,'Laptop','Technology','I am a huge gamer, so I need a good gaming laptop. I also work from home, which means I do all of my work on my laptop. Must have great specs.','2020-03-06T00:00:00.000Z'),
    (3,'Dining Table','Furniture','There are only two of us and we dont have company very often, so the table only has seat 2. It must be very sturdy and scratch resistant.','2020-03-07T00:00:00.000Z'),
    (4,'Dog Food','Other','I have a 10 year old pup who is the love of my life. I want him to have the best food and since he is getting old it should be formulated for older dogs.','2020-03-08T00:00:00.000Z'),
    (5,'Smart Phone','Technology','I use my phone all the time so it has to be good! My budget is only about $500. It needs to do the basics: calling, texting, etc.','2020-03-010T00:00:00.000Z'),
    (1,'Conditioner','Health & Beauty','This dry winter weather is not doing good things for my hair. I need a super hydrating conditioner that will prevent all the breakage and frizziness. I am willing to pay anything!','2020-03-16T00:00:00.000Z'),
    (2,'Sedan','Transportation','I do not drive very much. Usually about 25 miles per week. I am willing to buy a used car, but it must be reliable and long-lasting.','2020-03-18T00:00:00.000Z'),
    (3,'Knife Set','Household','Cooking is my passion and I want a new pair of knives to reflect that. They must stay sharp for a long time and cut smoothly. My budget is $75 per knife.','2020-03-19T00:00:00.000Z');

INSERT INTO recommend_comments (request_id,user_id,brand,why)
VALUES 
    (1,2,'Asics','I love Asics. They are so comfortable and last forever. If you keep an eye on sales, you can probably find them within your budget.'),
    (3,5,'Ikea','Ikea will by far give you the best bang for your buck. Plus, they have so many color options!'),
    (5,2,'Apple','I would just get an iPhone. You can get a refurbished one within your budget. iPhones have the easiest interface for your average phone user.'),
    (7,1,'Toyota','You cannot go wrong with a Toyota camry. My last one lasted me 240,000 miles and never broke down!'),
    (8,3,'Wusthof','I love my Wusthof knife set. They are such great quality and I have been using mine for years now.'),
    (8,1,'Henckels','Wusthof is good, bu Henckels is by far the best brand in my opinion. Great quality and so sleek looking.');

COMMIT;