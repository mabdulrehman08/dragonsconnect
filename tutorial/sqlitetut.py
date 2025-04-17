import sqlite3

con=sqlite3.connect("tutorial.db")
cur=con.cursor()
cur.execute("CREATE TABLE accounts(username,fname,lname)")

data = [
    ("jdoe01", "Jane", "Doe"),
    ("jschmoe02", "Joe", "Schmoe"),
    ("mjparker03", "MJ", "Parker"),
    ("jessica04", "Jess", "Ica"),
]
cur.executemany("INSERT INTO accounts VALUES(?, ?, ?)", data)
con.commit()