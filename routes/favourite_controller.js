
var models = require('../models/models.js');




// GET /users/:userid/favourites
/*exports.index = function(req, res, next) {

    var format = req.params.format || 'html';
    format = format.toLowerCase();

    models.Favourite
        .findAll({ 
              where: { userId: req.session.user.id},
              include: [ { model: models.User, as: 'Author' }, { model: models.Post, as: 'Post' } ],
              order: 'updatedAt DESC'
	            })
        .success(function(favourites) {
            switch (format) { 
              case 'html':
              case 'htm':
                  res.render('favourites/index', {
                    favourites: favourites
                  });
                  break;
              case 'json':
                  res.send(favourites);
                  break;
              case 'xml':
                  //res.send(posts_to_xml(posts));
                  break;
              case 'txt':
                  //res.send(posts.map(function(post) {
                  //    return post.title+' ('+post.body+')';
                  // }).join('\n'));
                  break;
              default:
                  console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                  res.send(406);
            }
        })
        .error(function(error) {
            next(error);
        });
};*/

exports.index = function(req, res, next) {

    var format = req.params.format || 'html';
    format = format.toLowerCase();

 models.Favourite.findAll({where: {userId: req.user.id}})
     .success(function(favourites) {

         // generar array con postIds de los post favoritos
         var postIds = favourites.map( 
                            function(favourite) 
                              {return favourite.postId;}
                           );

        // busca los posts identificados por array postIds
        var patch;
        if (postIds.length == 0) {
            patch= '"Posts"."id" in (NULL)';
        } else {
            patch='"Posts"."id" in ('+postIds.join(',')+')';
        } 
        // busca los posts identificados por array postIds
        models.Post.findAll({order: 'updatedAt DESC',
                    where: patch, 
                    include:[{model:models.User,as:'Author'},
                    {model:models.Favourite,as:'Favourite'} ]
                 })
                 .success(function(posts) {
                  for (var i = 0; i < posts.length; i++) {
                    posts[i].isFavourite = true;
                  }
          // console.log(posts);
          
            switch (format) { 
              case 'html':
              case 'htm':
                  res.render('posts/index', {
                    posts: posts
                  });
                  break;
              case 'json':
                  res.send(posts);
                  break;
              case 'xml':
                  res.send(posts_to_xml(posts));
                  break;
              case 'txt':
                  res.send(posts.map(function(post) {
                      return post.title+' ('+post.body+')';
                  }).join('\n'));
                  break;
              default:
                  console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                  res.send(406);
            }
        })
        .error(function(error) {
            next(error);
        });
      });
    };


// POST /posts
exports.put = function(req, res, next) {

    var fav = models.Favourite.build(
        { userId: req.session.user.id,
          postId: req.post.id
        });
    fav.save()
        .success(function() {
            req.flash('success', 'Favorito añadido con éxito.');
            res.redirect('/users/' + req.session.user.id + '/favourites');
        })
        .error(function(error) {
            next(error);
        });
};


exports.delete = function(req, res, next) {
     models.Favourite
        .find({where: {postId: req.post.id, userId: req.session.user.id}})
        .success(function(favourite) {
            if (favourite) {
                favourite.destroy()
                    .success(function() {
                        req.flash('success', 'Favorito eliminado');
                           res.redirect('/users/' + req.session.user.id + '/favourites');
                    })
                    .error(function(error) {
                        next(error);
                    });
            } else {
                req.flash('error', 'No existe este favorito');
                res.redirect('/users/' + req.session.user.id + '/favourites');
            }
        })
        .error(function(error) {
            next(error);
        });
};
