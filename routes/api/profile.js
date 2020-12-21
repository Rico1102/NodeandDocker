const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const User = require("../../models/users");
const Profile = require("../../models/profile");
const {
    check,
    validationResult
} = require("express-validator");

//Endpoint      /profile/
//Type          GET
//Access        private
//Use           get profile
router.get("/", authMiddleware, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate("user", ["username", "avatar"]);
        if (!profile) {
            return res.status(400).json({
                msg: "Profile doesn't exist"
            });
        }
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Endpoint      /profile/update/
//Type          POST
//Access        Private
//Desc          Create or update profile
router.post(
    "/update/",
    [
        authMiddleware,
        [
            check("status", "Status field is required").not().isEmpty(),
            check("skills", "Skills field is required").not().isEmpty(),
            check("firstname", "Firstname field is required").not().isEmpty(),
            check("lastname", "Lastname field is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        try {
            let {
                firstname,
                lastname,
                company,
                status,
                skills,
                youtube,
                instagram,
                facebook,
                linkedin,
                bio,
                githubusername,
            } = req.body;
            let profile = await Profile.findOne({
                user: req.user.id
            });
            if (!profile) profile = {};
            profile.user = req.user.id;
            profile.firstname = firstname;
            profile.lastname = lastname;
            profile.skills = skills;
            profile.status = status;
            if (company) profile.company = company;
            if (bio) profile.bio = bio;
            if (githubusername) profile.githubusername = githubusername;
            profile.social = {};
            if (youtube) profile.social.youtube = youtube;
            if (instagram) profile.social.instagram = instagram;
            if (facebook) profile.social.facebook = facebook;
            if (linkedin) profile.social.linkedin = linkedin;
            profile.lastUpdated = Date.now();
            profile = Profile(profile);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error");
        }
    }
);

//Enpoint       /profile/delete/
//Type          delete
//Access        private
//Desc          Delete an user profile
router.delete("/delete/", authMiddleware, async (req, res) => {
    try {
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        res.send("Profile deleted Successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Enpoint       /profile/all/
//Type          get
//Access        public
//Desc          get all user profiles
router.get("/all/", async (req, res) => {
    try {
        let profiles = await Profile.find().populate("user", [
            "username",
            "avatar",
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Enpoint       /profile/user/:user_id
//Type          get
//Access        public
//Desc          get user profile by user id
router.get("/user/:user_id", async (req, res) => {
    try {
        let profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["username", "avatar"]);
        if (!profile) {
            return res.status(400).json({
                msg: "No such profile exists"
            });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                msg: "No such profile exists"
            });
        }
        res.status(500).send("Server error");
    }
});


//Enpoint       /profile/add/experience/
//Type          POST
//Access        private
//Desc          add experience to profile
router.post('/add/experience/', [authMiddleware, [
    check('title', 'Title is required').exists(),
    check('company', 'Company is required').exists()
], ], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            return res.status(400).send({
                msg: "No profile exists for this user"
            });
        }
        let experience = {};
        let {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        experience.title = title;
        experience.company = company;
        if (location) experience.location = location;
        if (from) experience.from = from;
        if (to) experience.to = to;
        if (current) experience.current = true;
        else experience.current = false;
        if (description) experience.description = description;
        profile.experience.push(experience);
        profile.lastUpdated = Date.now();
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})



//Enpoint       /profile/update/experience/:user_id/:experience
//Type          PUT
//Access        private
//Desc          update existing experience
router.put('/update/experience/:experience', [authMiddleware, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            return res.status(400).json({
                msg: "No profile exists for this user"
            });
        }
        const experience = profile.experience.find(obj => String(obj._id) == req.params.experience);
        if (!experience) {
            return res.status(400).json({
                msg: "No such experience exists"
            });
        }
        const experienceIndex = profile.experience.findIndex(obj => String(obj._id) == req.params.experience);
        let {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        experience.title = title;
        experience.company = company;
        if (location) experience.location = location;
        if (from) experience.from = from;
        if (to) experience.to = to;
        if (current) experience.current = true;
        else experience.current = false;
        if (description) experience.description = description;
        profile.experience[experienceIndex] = experience;
        profile.lastUpdated = Date.now();
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                msg: "No such experience exists"
            })
        }
        res.status(500).send('Server error');
    }
})


//Enpoint       /profile/delete/experience/:experience
//Type          Delete
//Access        private
//Desc          delete existing experience
router.delete('/delete/experience/:experience', authMiddleware, async (req, res) => {
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            return res.status(400).json({
                msg: "No profile exists for this user"
            });
        }
        const experience = profile.experience.filter(obj => String(obj._id) != req.params.experience);
        profile.experience = experience;
        profile.lastUpdated = Date.now();
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})


//Enpoint       /profile/add/education/
//Type          POST
//Access        private
//Desc          add education to profile
router.post('/add/education/', [authMiddleware, [
    check('school', 'School is required').exists(),
    check('degree', 'Degree is required').exists(),
    check('field', 'Field is required').exists()
], ], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            return res.status(400).send({
                msg: "No profile exists for this user"
            });
        }
        let education = {};
        let {
            school,
            degree,
            field,
            place,
            from,
            to,
            current
        } = req.body;
        education.school = school;
        education.degree = degree;
        education.field = field;
        if (place) education.place = place;
        if (from) education.from = from;
        if (to) education.to = to;
        if (current) education.current = true;
        else education.current = false;
        profile.education.push(education);
        profile.lastUpdated = Date.now();
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})



//Enpoint       /profile/update/education/:user_id/:education
//Type          PUT
//Access        private
//Desc          update existing education
router.put('/update/education/:education', [authMiddleware, [
    check('school', 'School is required').exists(),
    check('degree', 'Degree is required').exists(),
    check('field', 'Field is required').exists()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            return res.status(400).json({
                msg: "No profile exists for this user"
            });
        }
        const education = profile.education.find(obj => String(obj._id) == req.params.education);
        if (!education) {
            return res.status(400).json({
                msg: "No such education exists"
            });
        }
        const educationIndex = profile.education.findIndex(obj => String(obj._id) == req.params.education);
        let {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        education.title = title;
        education.company = company;
        if (location) education.location = location;
        if (from) education.from = from;
        if (to) education.to = to;
        if (current) education.current = true;
        else education.current = false;
        if (description) education.description = description;
        profile.education[educationIndex] = education;
        profile.lastUpdated = Date.now();
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                msg: "No such education exists"
            })
        }
        res.status(500).send('Server error');
    }
})


//Enpoint       /profile/delete/education/:education
//Type          Delete
//Access        private
//Desc          delete existing education
router.delete('/delete/education/:education', authMiddleware, async (req, res) => {
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            return res.status(400).json({
                msg: "No profile exists for this user"
            });
        }
        const education = profile.education.filter(obj => String(obj._id) != req.params.education);
        profile.education = education;
        profile.lastUpdated = Date.now();
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;