const mongoose = require('mongoose');
const validUrl = require('valid-url');
const UrlShorten = mongoose.model('UrlShorten');
const shortCode = require('nanoid');

const cache = require('../services');
module.exports = app => {
    app.get('/api/item/:code', async(req, res) => {
        const urlCode = req.params.code;
        const item = await UrlShorten.findOne({ urlCode: urlCode });
        if (item) {
            return res.redirect(item.originalUrl);
        } else {
            return res.redirect(constants.errorUrl);
        }
    });

    app.post('/api/item', async(req, res) => {
        const { originalUrl } = req.body;
        const shortBaseUrl = 'https://warm-sea-77822.herokuapp.com/';
        if (validUrl.isUri(shortBaseUrl)) {} else {
            return res.status(404).json({ err: 'Invalid Base Url format' });
        }

        const updatedAt = new Date();
        const queryOptions = { originalUrl };
        if (validUrl.isUri(originalUrl)) {
            let urlData;
            try {
                urlData = await cache.getFromCache(
                    'originalUrl',
                    JSON.stringify(queryOptions)
                );
                if (!urlData) {
                    urlData = await UrlShorten.findOne(queryOptions).exec();
                }

                if (urlData) {
                    res.status(200).json(urlData);
                } else {
                    const urlCode = shortCode(5);
                    shortUrl = shortBaseUrl + '/' + urlCode;
                    const itemToBeSaved = { originalUrl, shortUrl, urlCode, updatedAt };

                    const item = new UrlShorten(itemToBeSaved);
                    await item.save();
                    cache.addToCache(
                        'originalUrl',
                        JSON.stringify(queryOptions),
                        itemToBeSaved
                    );
                    res.status(200).json(itemToBeSaved);
                }
            } catch (err) {
                res.status(401).json({ err: 'Invalid User Id' });
            }
        } else {
            return res.status(401).json({ err: 'Invalid Original Url.' });
        }
    });
};