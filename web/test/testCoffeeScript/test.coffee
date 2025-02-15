# browserify を使って require を使えないだろうか？
# coffeescript は type="module"ではないので、import は使えない感じ。
# 


do ->
    name = "CoffeeScript"

    whatIsThis = ->
        "This is The " + name + "!"

    alert whatIsThis()
