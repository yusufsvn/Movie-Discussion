class linkedlist {
    constructor(user,text,timestamp,id ) {
        this.id =id;
        this.text = text;
        this.user = user;
        this.timestamp = timestamp
        this.replies = []; // Yanıtlar için bağlı düğümler
    }

    addReply(replyNode) {
        this.replies.push(replyNode);
    }
}
module.exports =linkedlist;