(function () {
  $.InfiniteTweets = function (el) {
    this.$el = $(el);
    this.$feed = this.$el.find("#feed");
    this.maxCreatedAt = null;
    this.$el.on("click", ".fetch-more", this.fetchTweets.bind(this))
  };

  $.InfiniteTweets.prototype.fetchTweets = function (e) {
    e.preventDefault();
    var that = this;

    var ajaxOptions = {
      url: "/feed",
      method: "get",
      dataType: "json",
      success: function(tweets) {
        that.renderTweets(tweets);
        if (tweets.length < 20) {
          that.$el.find(".fetch-more").replaceWith("<p>No more tweets!</p>");
        };
      }
    };

    if (this.maxCreatedAt !== null) {
      ajaxOptions.data = { max_created_at: this.maxCreatedAt };
    };

    $.ajax(ajaxOptions);

  };

  $.InfiniteTweets.prototype.renderTweets = function (tweets) {
    var that = this;
    $(tweets).each(function (index, tweet) {
      if (index === 0) {
        that.maxCreatedAt = tweet.created_at;
        console.log(tweet);
        console.log(that);
      }
      var $li = $("<li>" + JSON.stringify(tweet) + "</li>");
      that.$feed.append($li);
    });
  };


  $.fn.infiniteTweets = function () {
    return this.each(function () {
      new $.InfiniteTweets(this);
    });
  };

})();

$(function () {
  $(".infinite-tweets").infiniteTweets();
});
