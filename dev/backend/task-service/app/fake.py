from random import randint
from . import db
from .documents import User, Post, Comment, Reaction, Icons


# Used to generate fake users
def users(count=20):
    fake = Faker()
    i = 0
    while i < count:
        u = User(email=fake.email(),
                 username=fake.user_name(),
                 password='password',
                 confirmed=True,
                 name=fake.name(),
                 location=fake.city(),
                 about_me=fake.text(),
                 member_since=fake.past_date())
        db.session.add(u)
        try:
            db.session.commit()
            i += 1
        except IntegrityError:
            db.session.rollback()


# Used to generate fake posts
def posts(count=40):
    if User.query.count() < 1:
        users()

    fake = Faker()
    user_count = User.query.count()
    for i in range(count):
        u = User.query.offset(randint(0, user_count - 1)).first()
        p = Post(body=fake.text(),
                 timestamp=fake.past_date(),
                 author=u)
        db.session.add(p)
    db.session.commit()


# Used to generate fake comments
def comments(count=60):
    if Post.query.count() < 1:
        posts()

    fake = Faker()
    user_count = User.query.count()
    post_count = Post.query.count()
    for i in range(count):
        u = User.query.offset(randint(0, user_count - 1)).first()
        p = Post.query.offset(randint(0, post_count - 1)).first()

        c = Comment(body=fake.text(),
                    post=p,
                    timestamp=fake.past_date(),
                    author=u)
        db.session.add(c)
    db.session.commit()

# Used to randomize the following


def followers(count=60):
    if User.query.count() < 1:
        users()

    user_count = User.query.count()
    for i in range(count):
        u1 = User.query.offset(randint(0, user_count - 1)).first()
        u2 = User.query.offset(randint(0, user_count - 1)).first()
        u1.follow(u2)
    db.session.commit()


# Used to fake reactions
def reactions(count=60):
    if User.query.count() < 1:
        users()

    user_count = User.query.count()
    comment_count = Comment.query.count()
    for i in range(count):
        u = User.query.offset(randint(0, user_count - 1)).first()
        c = Comment.query.offset(randint(0, comment_count - 1)).first()

        u.reaction(comment=c, icon=randint(1, len(Icons)))
    db.session.commit()
