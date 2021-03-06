(function () {
  $.InfiniteTweets = function (el) {
    this.$el = $(el);
    this.$feed = this.$el.find("#feed");
    this.maxCreatedAt = null;
    this.tweetsTemplate = this.$el.find("#tweets-template").html();

    this.$el.on("click", ".fetch-more", this.fetchTweets.bind(this));
    this.$el.on("insert-tweet", this.insertTweet.bind(this));
  };

  $.InfiniteTweets.prototype.fetchTweets = function (e) {
    e.preventDefault();
    var that = this;

    var ajaxOptions = {
      url: "/feed",
      method: "get",
      dataType: "json",
      success: function(tweets) {
        that.insertTweets(tweets);
        if (tweets.length > 0) {
          that.maxCreatedAt = tweets[tweets.length - 1].created_at;
        }
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

  $.InfiniteTweets.prototype.insertTweets = function (tweets) {
    var that = this;
    var tweetsTemplateParser = _.template(this.tweetsTemplate);
    var renderedTweets = tweetsTemplateParser({ tweets: tweets });

    this.$feed.append($(renderedTweets));
    // $(tweets).each(function (index, tweet) {
    //   if (index === tweets.length - 1) {
    //     that.maxCreatedAt = tweet.created_at;
    //   }
    //   var $li = $("<li>" + JSON.stringify(tweet) + "</li>");
    //   that.$feed.append($li);
    // });
  };

  $.InfiniteTweets.prototype.insertTweet = function (e, tweet) {
    var that = this;
    var tweetsTemplateParser = _.template(this.tweetsTemplate);
    var renderedTweet = tweetsTemplateParser({ tweets: [tweet] });

    this.$feed.prepend($(renderedTweet));

    if (this.maxCreatedAt === null){
      this.maxCreatedAt = tweet.created_at;
    }
  }

  $.fn.infiniteTweets = function () {
    return this.each(function () {
      new $.InfiniteTweets(this);
    });
  };

})();

$(function () {
  $(".infinite-tweets").infiniteTweets();
});
