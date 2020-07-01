# ColabNote
This is a collaborative text editor that allows realtime text editing among users. Document access authorization is a planned feature. The text editor is built on top of Slate.js. The collaborative editing part uses web sockets using socket.io. Authentication using bcrypt and tokens. MongoDB as the database.

Instructions to run:
1. run "npm install" in the /colabnote directory
2. run "npm install" in the /server directory
3. start server by running "node src/index.js" in the /server directory
4. run "npm start" in the /colabnote directory to start the frontend


Demo :

![](demo.gif)
