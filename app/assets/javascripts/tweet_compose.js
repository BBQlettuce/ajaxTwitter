(function () {
  $.TweetCompose = function (el) {
    this.$el = $(el);
    this.$feed = $(this.$el.data("tweets-ul"))
    this.$charsLeft = this.$el.find(".chars-left");
    this.$textarea = this.$el.find("textarea");

    this.$charsLeft.text(140);

    this.$el.on("submit", this.submit.bind(this));
    this.$textarea.on("input", this.counter.bind(this));
    this.$el.on("click", "a.add-mentioned-user", this.addMentionedUser.bind(this));
    this.$el.on("click", "a.remove-mentioned-user", this.removeMentionedUser.bind(this));
  };

  $.TweetCompose.prototype.removeMentionedUser = function (e) {
    var $linkClicked = $(e.currentTarget);
    var $parentDiv = $linkClicked.parent();
    $parentDiv.remove();
  };

  $.TweetCompose.prototype.addMentionedUser = function (e) {
    var html = this.$el.find(".user-selection").html();
    this.$el.find(".mentioned-users").append(html);
  };

  $.TweetCompose.prototype.counter = function (e) {
    var input = this.$textarea.val();

    var currentLength = input.length;
    this.$charsLeft.text(140 - currentLength);
  }

  $.TweetCompose.prototype.submit = function (e) {
    e.preventDefault();

    var inputs = $(e.currentTarget).serializeJSON();
    //console.log(inputs);
    this.$el.find(":input").prop("disabled", true);

    // this.$feed.trigger("insert-tweet", ["insert-tweet", inputs]);

    $.ajax({
      url: "/tweets",
      method: "post",
      data: inputs,
      dataType: "json",
      success: function (tweet) {
        this.handleSuccess(tweet);
      }.bind(this)
    })
  };

  $.TweetCompose.prototype.handleSuccess = function (tweet) {
    this.$feed.trigger("insert-tweet", tweet);

    // var $li = $("<li>" + JSON.stringify(tweet) + "</li>")
    // this.$feed.prepend($li);
    this.clearInput();
    this.$el.find(":input").prop("disabled", false);
  };

  $.TweetCompose.prototype.clearInput = function () {
    var inputs = this.$el.find(":input")
    inputs.each(function () {
      if (this.type !== "submit") {
        $(this).val("");
      }
    });

    this.$el.find(".mentioned-users").empty();
    this.$charsLeft.text(140);
  };

  $.fn.tweetCompose = function () {
    return this.each(function () {
      new $.TweetCompose(this);
    });
  };

})();

$(function() {
  $(".tweet-compose").tweetCompose();
});
