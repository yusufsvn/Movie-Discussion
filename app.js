const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');


//Data models
const User = require('./models/UserDataModel');
const Dizi = require('./models/SeriesDataModel');
const Film = require('./models/FilmDataModel');
const remark = require('./models/CommentDataModel');
//linkked list model
const linkedlis = require('./linkedlist');


const app = express()

const dbURL = "mongodburl"
mongoose.connect(dbURL)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

//mongodb ye kaydetmek için mongo store    
const store = MongoStore.create({
    mongoUrl: dbURL,
    collectionName: 'sessions',
    //time to live 
    ttl: 60 * 10,
    //oturum sonlandığında mongodb den oto silme yapar
    autoRemove: 'native'
})
//bundan sonraki adım session için get istekleri yazmak


app.set('view engine', 'ejs')


//iç içe nesne varsa req.body de
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//css dosyları görmesi için
app.use(express.static('public'));
//req.body nin boyutu
app.use(morgan('tiny'))

app.use(session({
    //güvenlik için .env dosyasına koy
    secret: '35b59c26afb4503425e542825cd2e05cbed44f',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});



app.get('/', (req, res) => {
    req.session.user
    res.render('index', { title: 'Film Atlas' })
})

//logout process
app.get('/logout',(req,res)=>{
    req.session.destroy((err) =>{
        if (err){
            console.log(err);
            res.send('çıkış yaparken hata oluştu');
        }
        else{
            res.redirect('/')
        }
    })
})

app.get('/hesap',(req,res)=>{
    
    if(req.session.user){
        const user = req.session.user 
        res.render('hesap',{user});
    }
    else{
        res.json('404',{errmsg:'Lütfen Giriş Yapınız'})
    }
    

    
})

app.get('/girispage', (req, res) => {
    res.render('girisPage', { title: 'giriş yap' })
})
app.get('/uyeolPage', (req, res) => {
    res.render('uyeolPage', { title: 'uye ol' })
})

app.get('/anasayfa', (req, res) => {
    res.render('anasayfa')
})

app.delete('/admin/sil', (req, res) => {
    console.log("ben admin silim");
})

app.get('/diziler', (req, res) => {
    let series = []
    Dizi.find({})
        .then((result) => {
            for (let i = 0; i < result.length; i++) {
                series.push([
                    result[i].title,
                    result[i].info,
                    result[i].seasonsize,
                    result[i].avrgchapsize,
                    result[i]._id
                ])
            }
            res.render('diziler', { series: series });
        })
        .catch((err) => {
            console.log(err)
        })
})



app.get('/admin/login', (req, res) => {
    res.render('adminlogin')
})

app.get('/Filmler', (req, res) => {
    let movies = []
    Film.find({})
        .then((result) => {
            for (let i = 0; i < result.length; i++) {
                movies.push([
                    result[i].title,
                    result[i].info,
                    result[i].lengthofmovie,
                    result[i]._id
                ])
            }
            res.render('Filmler', { movies: movies });
        })
        .catch((err) => {
            console.log(err)
        })
})

//model predict request for movies
app.get('/templeofpage', async (req, res) => {

    let data = {text:''}
        
    try {
        const resultlist = req.session.resultlist;
        const yorumlist = req.session.yorumlist;
        let countofpstv = 0
        predictList = []
        
        for(let i=0;i<yorumlist.length;i++) {
            data.text = yorumlist[i].text
            await axios({
                method:'post',
                url:'http://127.0.0.1:8000/predict',
                data:JSON.stringify({"text":yorumlist[i].text}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response =>{
                console.log(response.data)
                if(response.data == 1){
                    countofpstv +=1
                }
                predictList.push(response.data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }

        const ratio = parseInt((countofpstv/predictList.length)*100)
     
        console.log(predictList); // Python'dan gelen yanıtı döndür
        res.render('templeofpage',{resultlist, yorumlist,ratio});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
      }
    


});

//model predict request for series
app.get('/templeofseries', async (req, res) => {
    let data = {text:''}
        
    try {
        const resultlist = req.session.resultlist;
        const yorumlist = req.session.yorumlist;
        let countofpstv = 0
        predictList = []
        
        for(let i=0;i<yorumlist.length;i++) {
            data.text = yorumlist[i].text
            await axios({
                method:'post',
                url:'http://127.0.0.1:8000/predict',
                data:JSON.stringify({"text":yorumlist[i].text}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response =>{
                console.log(response.data)
                if(response.data == 1){
                    countofpstv +=1
                }
                predictList.push(response.data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }

        const ratio = parseInt((countofpstv/predictList.length)*100)
     
        console.log(predictList); // Python'dan gelen yanıtı döndür
        res.render('templeofseries',{resultlist, yorumlist,ratio});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
      }
    
});

//movie and comment
app.get('/filmler/goPage', async (req, res) => {
    const movieId = req.query.movieId;
    console.log(movieId)
    let resultlist = []
    let yorumlist = [];
    
    await Film.findById(movieId)
        .then((result) => {
            resultlist = result
        })
        .catch(error => {
            console.error("Hata:", error);
            res.status(500).json({ success: false, message: "Sunucu hatası." });
        });

    await remark.find({})
        .then((result) => {
            for (i = 0; i < result.length; i++) {
                if (movieId == result[i].filmid) {
                    if (result[i].parentCommentId == 'null') {
                        let timestamp = result[i].timestamp
                        let text = result[i].text
                        let user1 = result[i].user[0]
                        let id = result[i]._id
                        let node1 = new linkedlis(user1, text, timestamp, id)
                            
                        for (let j = 0; j < result.length; j++) {
                            if (result[j].parentCommentId == result[i]._id.toString()) {
                                node1.addReply(result[j])                              
                            }
                        }
                        yorumlist.push(node1)
                        
                    }
                }
                //yanıtları olanlar birbirne bağlanıp yorumlar listesine eklendi
                else {
                    console.log("hatalı movieId")
                }
            }
            console.log(yorumlist)
            
        });
    req.session.resultlist = resultlist
    req.session.yorumlist = yorumlist
    res.json({resultlist:[resultlist],yorumlist});    
});



//Admin post request
app.post('/admin', (req, res) => {
    const getUser = User.findOne({ email: req.body.email })
        .then((user) => {
            adminreq = req.body.email
            adminuser = user.email
            if ('admin@mail.com' == adminreq && adminreq == adminuser) {
                res.render('admin')
            }
            else {
                res.json('bilgiler uyuşmuyor')
            }
        })
        .catch((err) => {
            console.log(err)
        })
})
app.post('/admin/searchitem', (req, res) => {
    //formdan gelen input:req.body.searchinput
    input = req.body.input
    //filmleri getir
    console.log(input)
    const filmList = []
    const diziList = []
    Promise.all([
        Film.find({})
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    filmList.push(result[i].title)
                }
            }),
        Dizi.find({})
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    diziList.push(result[i].title)
                }
            })
    ])
        .then(() => {
            if (filmList.includes(input) || diziList.includes(input)) {
                console.log(input)
                res.json(input)
            }
        })

})
app.post('/admin/addserie', (req, res) => {
    newDizi = new Dizi({
        title: req.body.title,
        info: req.body.info,
        seasonsize: req.body.seasonsize,
        avrgchapsize: req.body.avrgchapsize,
        summary: req.body.summary,
        cast: req.body.cast,
        director: req.body.director,
        img: req.body.img
    })
    newDizi.save()
        .then((result) => {
            res.redirect('/')
        })
        .catch((err) => {
            res.json(err)
        })
})
app.post('/admin/addmovie', (req, res) => {
    console.log(req.body)

    newFilm = new Film({
        title: req.body.title,
        info: req.body.info,
        lengthofmovie: req.body.lengthofmovie,
        summary: req.body.summary,
        cast: req.body.cast,
        director: req.body.director,
        img: req.body.img
    })
    newFilm.save()
        .then((result) => {
            res.redirect('/admin')
        })
        .catch((err) => {
            res.json(err)
        })
})


// series page
app.get('/diziler/goPage', async (req, res) => {
    const movieId = req.query.movieId;
    console.log(movieId)
    let resultlist = []
    let yorumlist = [];
    
    await Dizi.findById(movieId)
        .then((result) => {
            resultlist = result

        })
        .catch(error => {
            console.error("Hata:", error);
            res.status(500).json({ success: false, message: "Sunucu hatası." });
        });
        
    await remark.find({})
        .then((result) => {
            for (i = 0; i < result.length; i++) {
                if (movieId == result[i].filmid) {
                    if (result[i].parentCommentId == 'null') {
                        let timestamp = result[i].timestamp
                        let text = result[i].text
                        let user1 = result[i].user[0]
                        let id = result[i]._id
                        let node1 = new linkedlis(user1, text, timestamp, id)
                            
                        for (let j = 0; j < result.length; j++) {
                            if (result[j].parentCommentId == result[i]._id.toString()) {
                                node1.addReply(result[j])
                                                               
                            }
                        }
                        yorumlist.push(node1)
                        
                    }
                }
                else {
                    console.log("hatali movieId")
                }
            }
            console.log(yorumlist)
            
        });
    req.session.resultlist = resultlist
    req.session.yorumlist = yorumlist
    res.json({resultlist:[resultlist],yorumlist}); 
})

//sing up
app.post('/uyeolPage', (req, res) => {
    newuser = new User({
        isim: req.body.isim,
        soyisim: req.body.soyisim,
        email: req.body.email,
        parola: req.body.parola
    });

    newuser.save()
        .then((result) => {
            res.redirect('/girisPage')
        })
        .catch((err) => {
            console.log(err)
        })

})

//login 
app.post('/girisPage/getuser', (req, res) => {
    const getUser = User.findOne({ email: req.body.email })
        .then((user) => {
            pass = user.parola;
            if (user.parola == req.body.parola) {
                req.session.user = {
                    name: user.isim,
                    surname: user.soyisim
                },
                    res.render('anasayfa')
            }
            else {
                res.send('bilgiler uyuşmuyor')
            }
        })
        .catch((err) => {
            console.log(err)
        })
})


//comment saving
app.post('/movies/send/comment', (req, res) => {
    userInfo = [req.session.user]
    comment = req.body.comment
    const filmId = req.body.id
    const timestamp = new Date();
    const year = timestamp.getFullYear()
    const month =timestamp.getMonth()+1;
    const day =timestamp.getDay()
    const hour =timestamp.getHours()
    let min =timestamp.getMinutes()
    if(min<10){
        let tmp = min;
        min = "0" + tmp
    }    
    const formattedDate = `${day}/${month}/${year} ${hour}:${min}`;

    comment = new remark({

        filmid: filmId,
        user: userInfo,
        text: comment,
        timestamp: formattedDate,
        parentCommentId: 'null'
    })
    comment.save()
        .then((result) => {
            console.log('yorum başarılı')
            res.redirect('/filmler')
        })
        .catch((err) => {
            res.json(err)
        })


})

//reply saving
app.post('/movies/send/response', (req, res) => {
    const userInfo = [req.session.user]; 
    const commentText = req.body.replyText; 
    const filmId = req.body.filmid;
    const parentCommentId = req.body.parentId;
    const timestamp = new Date().toString();



    const newComment = new remark({
        filmid: filmId,
        user: userInfo,
        text: commentText,
        timestamp: timestamp,
        parentCommentId: parentCommentId
    });

    newComment.save()
        .then((savedComment) => {
            res.redirect('/filmler')
        })
        .catch((err) => {
            console.error("Yorum kaydedilemedi:", err);
            res.status(500).json({ success: false, message: "Yorum kaydedilemedi" });
        });
});

app.use((req,res) =>{
    res.status(404).render('404',{errmsg:'sayfa bulunamadı'});
});