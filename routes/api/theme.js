"use strict";
//todo: refactor me
var async = require('co').wrap;
var router = require('express').Router();
var moment = require('moment');
var validator = require('validator');

var Query = require('../../models/query');
var Model = require('../../mongoose/theme');

var list = async(function* (q) {
    var total = yield Model.countByQuery(q);
    var items = yield Model.findByQuery(q);
    return { total: total, items: items };
});

var getById = async(function* (id){
    return yield Model.findById(id).exec();
});

var insert = async(function* (dto){
    var model = new Model(dto);
    return yield model.save();
});

var update = async(function* (dto){
    // var model = yield Model.findById(dto._id).exec();
    // var model = new Model(dto);
    // return yield model.save();
    return yield Model.findOneAndUpdate({'_id': dto._id}, dto)
});

var remove = async(function* (id){
    return yield Model.remove({_id: id});
});

var save = async(function* (dto){
    if (dto._id){
        return yield update(dto);
    }
    return yield insert(dto);
});

var validate = function(dto) {
    var errors = {};
    if (!dto.name){
        errors['name'] = errors['name'] || [];
        errors['name'].push('Необходимо ввести наименование');
    }
    if (!(dto.yandex && dto.yandex.query)){
        errors['yandex.query'] = errors['yandex.query'] || [];
        errors['yandex.query'].push('Необходимо ввести запрос');
    }
    if (!(dto.yandex && dto.yandex.pages)){
        errors['yandex.pages'] = errors['yandex.pages'] || [];
        errors['yandex.pages'].push('Необходимо ввести количество страниц');
    }
    if (!(dto.yandex && dto.yandex.pages && validator.isInt(dto.yandex.pages.toString(), { min: 1, max: 200 }))){
        errors['yandex.pages'] = errors['yandex.pages'] || [];
        errors['yandex.pages'].push('Необходимо ввести положительное число, не превышающее 200');
    }

    if (!(dto.google && dto.google.query)){
        errors['google.query'] = errors['google.query'] || [];
        errors['google.query'].push('Необходимо ввести запрос');
    }
    if (!(dto.google && dto.google.pages)){
        errors['google.pages'] = errors['google.pages'] || [];
        errors['google.pages'].push('Необходимо ввести количество страниц');
    }
    if (!(dto.google && dto.google.pages && validator.isInt(dto.google.pages.toString(), { min: 1, max: 200 }))){
        errors['google.pages'] = errors['google.pages'] || [];
        errors['google.pages'].push('Необходимо ввести положительное число, не превышающее 200');
    }

    return errors;
};

router.get('/list', function (req, res, next) {
    var query = new Query(req.query.q);
    var action = list(query);
    action.then(function (data) {
        return res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

router.get('/get', function(req, res, next) {
    var action = getById(req.query.id);
    action.then(function(data){
        res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

router.post('/save', function(req, res, next) {
    var errors = validate(req.body)
    if (Object.keys(errors).length > 0){
        res.json(errors, 400);
        return;
    }
    var action = save(req.body);
    action.then(function(data){
        res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

router.post('/remove', function(req, res, next) {
    var action = remove(req.query.id);
    action.then(function(data){
        res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

module.exports = router;