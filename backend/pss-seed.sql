-- Seed data generated by Chat GPT

-- Seed data for users table
INSERT INTO users (first_name, last_name, username, email, hashed_password) VALUES
('Three', 'User', 'three', 'three@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Seven', 'User', 'seven', 'seven@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Sasuke', 'Uchiha', 'sasuke', 'sasuke@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Naruto', 'Uzumaki', 'naruto', 'naruto@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('LeBron', 'James', 'lebron', 'lebron@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Stephen', 'Curry', 'stephen', 'stephen@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Kevin', 'Durant', 'kevin', 'kevin@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('James', 'Harden', 'james', 'james@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Tom', 'Brady', 'tom', 'tom@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Patrick', 'Mahomes', 'patrick', 'patrick@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Russell', 'Westbrook', 'russell', 'russell@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Aaron', 'Rodgers', 'aaron', 'aaron@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Derrick', 'Henry', 'derrick', 'derrick@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Luka', 'Doncic', 'luka', 'luka@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Zion', 'Williamson', 'zion', 'zion@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Julio', 'Jones', 'julio', 'julio@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('DeAndre', 'Hopkins', 'deandre', 'deandre@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Kawhi', 'Leonard', 'kawhi', 'kawhi@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Lamar', 'Jackson', 'lamar', 'lamar@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu'),
('Kyrie', 'Irving', 'kyrie', 'kyrie@example.com', '$2b$12$CStxzsQCEs2Dy5zfMx3bquhd7xu0qDgD9.XqKE8z/I/w0lsVCFcKu');


-- Seed data for games table
INSERT INTO games (title, description, release_date, genre, studio, game_api_id) VALUES
('The Elder Scrolls V: Skyrim', 'Open world action role-playing game', '2011-11-11', 'RPG', 'Bethesda Game Studios', 1001),
('Grand Theft Auto V', 'Action-adventure game in an open world', '2013-09-17', 'Action', 'Rockstar North', 1002),
('The Legend of Zelda: Breath of the Wild', 'Action-adventure game in a massive open world', '2017-03-03', 'Adventure', 'Nintendo', 1003),
('The Witcher 3: Wild Hunt', 'Open world action role-playing game', '2015-05-19', 'RPG', 'CD Projekt Red', 1004),
('Red Dead Redemption 2', 'Action-adventure game set in the Wild West', '2018-10-26', 'Action', 'Rockstar Studios', 1005),
('Dark Souls III', 'Challenging action role-playing game', '2016-04-12', 'RPG', 'FromSoftware', 1006),
('Mass Effect 2', 'Science fiction action role-playing game', '2010-01-26', 'RPG', 'BioWare', 1007),
('The Last of Us', 'Action-adventure survival horror game', '2013-06-14', 'Adventure', 'Naughty Dog', 1008),
('Doom', 'First-person shooter', '2016-05-13', 'FPS', 'id Software', 1009),
('Overwatch', 'First-person shooter with team-based gameplay', '2016-05-24', 'FPS', 'Blizzard Entertainment', 1010);

-- Seed data for favorite_games table
INSERT INTO favorite_games (user_id, game_id) VALUES
(1, 3),
(1, 7),
(2, 5),
(2, 3),
(3, 5),
(3, 4),
(4, 5),
(4, 6),
(5, 1),
(5, 7),
(5, 8),
(6, 2),
(6, 9),
(6, 10),
(7, 3),
(7, 1),
(7, 2),
(8, 4),
(8, 3),
(8, 6),
(9, 5),
(9, 1),
(9, 7),
(10, 2),
(10, 8),
(10, 9),
(11, 3),
(11, 4),
(11, 5),
(12, 6),
(12, 7),
(12, 8),
(13, 9),
(13, 1),
(13, 2),
(14, 10),
(14, 3),
(14, 4),
(15, 5),
(15, 6),
(15, 7),
(16, 8),
(16, 9),
(16, 10),
(17, 1),
(17, 2),
(17, 3),
(18, 4),
(18, 5),
(18, 6),
(19, 7),
(19, 8),
(19, 9),
(20, 10),
(20, 1),
(20, 2);

-- Seed data for reviews table
INSERT INTO reviews (content, rating, user_id, game_id) VALUES
('Great game, highly recommended!', 5.0, 1, 1),
('Fun to play, but some issues.', 3.5, 2, 2),
('Amazing game, loved it!', 5.0, 3, 3),
('Too difficult for me.', 2.5, 4, 4),
('Best game I have ever played!', 5.0, 5, 5),
('Solid gameplay, good graphics.', 4.0, 1, 6),
('Interesting story, but the gameplay is lacking.', 3.0, 2, 7),
('One of the best games of the year!', 4.5, 3, 8),
('I enjoyed it a lot, but it has some flaws.', 4.0, 4, 9),
('An average game with a few good moments.', 3.0, 5, 10),
('The game is good but not great.', 3.5, 6, 1),
('The story is amazing, but the controls are clunky.', 3.5, 7, 2),
('Graphics are fantastic, but the story is weak.', 3.0, 8, 3),
('A really fun experience overall!', 4.5, 9, 4),
('I couldnt get into it, not my type of game.', 2.0, 10, 5),
('The game has a lot of potential, but it falls short.', 3.0, 11, 6),
('A great game for casual players.', 4.0, 12, 7),
('The soundtrack is amazing, but the gameplay is repetitive.', 3.5, 13, 8),
('Loved the characters, but the story was confusing.', 3.5, 14, 9),
('Not the best, but still enjoyable.', 3.5, 15, 10);




-- Seed data for user_followers table
INSERT INTO user_followers (user_id, follower_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 5),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(7, 5),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 5),
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(9, 5),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(10, 5);

-- Seed data for posts table
INSERT INTO posts (content, user_id) VALUES
('I just finished playing Skyrim, what an amazing game!', 1),
('Anyone up for some GTA V online?', 2),
('Breath of the Wild is a masterpiece!', 3),
('I need help in The Witcher 3, any tips?', 4),
('Red Dead Redemption 2 is such a great game!', 5),
('Playing Cyberpunk 2077, any recommendations on what to do first?', 6),
('I just started playing Dark Souls, it is so challenging!', 7),
('What are your thoughts on the upcoming Elder Scrolls VI?', 8),
('Has anyone tried the new Assassins Creed game?', 9),
('I cant wait for the next God of War!', 10),
('Any fans of Mass Effect here?', 11),
('Just got my hands on the new Spider-Man game. Its awesome!', 12),
('Whats your favorite indie game?', 13),
('I love playing co-op games, any suggestions?', 14),
('Looking for a good racing game, any recommendations?', 15),
('Horizon Zero Dawn is such an underrated gem!', 16),
('What are your favorite game soundtracks?', 17),
('Any fans of the Uncharted series?', 18),
('I just started playing Final Fantasy VII Remake, its amazing!', 19),
('What are your thoughts on the new Resident Evil game?', 20);


-- Seed data for post_likes table
INSERT INTO post_likes (post_id, user_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3),
(3, 1),
(3, 2),
(4, 1),
(4, 3),
(5, 1),
(6, 1),
(6, 2),
(6, 4),
(7, 2),
(7, 3),
(8, 1),
(8, 3),
(9, 2),
(9, 3),
(10, 1),
(10, 4),
(11, 2),
(11, 3),
(11, 5),
(12, 1),
(12, 3),
(12, 4),
(13, 2),
(13, 4),
(13, 5),
(14, 1),
(14, 3),
(14, 5),
(15, 2),
(15, 4),
(16, 1),
(16, 3),
(17, 2),
(17, 5),
(18, 1);

-- Seed data for comments table
INSERT INTO comments (content, user_id, post_id) VALUES
('Totally agree about Skyrim!', 3, 1),
('I can join you for GTA V online later.', 4, 2),
('Breath of the Wild has the best open world!', 5, 3),
('Also, dont forget to upgrade your armor in The Witcher 3.', 1, 4),
('RDR2s story is so immersive.', 2, 5),
('Ive spent hundreds of hours in Skyrim.', 4, 1),
('GTA V online is so much fun with friends.', 5, 2),
('The puzzles in Breath of the Wild are amazing.', 1, 3),
('In The Witcher 3, always loot everything!', 2, 4),
('I love the characters in RDR2.', 3, 5),
('Skyrim has so many mods available.', 5, 1),
('Heists in GTA V are the best!', 1, 2),
('The graphics in Breath of the Wild are stunning.', 2, 3),
('Alchemy is also important in The Witcher 3.', 3, 4),
('RDR2s open world is so detailed!', 4, 5);


-- Seed data for groups table
-- Seed data for groups table
INSERT INTO groups (name, description, game_id, owner_id) VALUES
('SkyrimFans', 'A group for fans of Skyrim', 1, 1),
('GTAVPlayers', 'Join us for some GTA V action', 2, 2),
('ZeldaLovers', 'For fans of The Legend of Zelda series', 3, 3),
('Witcher3Guild', 'Share your experiences in The Witcher 3', 4, 4),
('RedDeadCrew', 'Discuss everything about Red Dead Redemption 2', 5, 5);

-- Seed data for group_users table
INSERT INTO group_users (group_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 3),
(3, 4),
(4, 4),
(4, 5),
(5, 5),
(5, 1);


