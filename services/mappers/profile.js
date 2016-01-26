"use strict";
var hitToProfile = function (hit, profile) {
    profile = profile || {};
    var source = hit._source;
    profile.id = hit._id;
    profile.source = source.source;
    profile.href = source.href;
    profile.sm_profile_id = source.sm_profile_id;
    profile.name = source.name;
    profile.city = source.city;
    profile.gender = source.gender;
    profile.reach = source.reach;
    return profile;
};

module.exports.hitToProfile = hitToProfile;
