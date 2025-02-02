require "js"
def setting
    #PP::addEventListener("flag","click") do
    #    puts "flag clicked"
    #end
    PP::whenFlag do
        puts "flag clicked (2)"
        i = 0
        # TODO 変数 i が do ブロックの中で有効にならない。
        PP::while( i<50) do 
            puts "flag while"
            i += 1
            puts "i=#{i}"
#            if i > 50
#                break #  Fiberのなかでは break を使えない。
#            end
        end
    end

    # JSのような並列処理にならない！
    j = 0
    canvas = JS::global[:P][:canvas]
    canvas.addEventListener "click" do

        PP::while do 
            puts "canvas while==============="
            j += 1
            puts "j=#{j}====================="
            if j > 50 
                break
            end
        end
    end
end