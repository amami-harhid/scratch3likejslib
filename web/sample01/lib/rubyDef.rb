require "js"
require "async"
class PP
    def self.while(condition, &block)
#            block.call
        while condition do
            fiber = Fiber.new do
                block.call
                # yield
            end
            fiber.resume
            sleep 0.033
        end
    end
    def self.loadImage(img, name)
        _p = JS::global[:P]
        _p.loadImage(img, name);
    end
    def self.preload(&block)
        yield block
    end
    def self.createStage(name)
       JS::global.call(:createStage, name)
    end
    def self.addImage(imgName)
        JS::global.call(:addImage, imgName)
    end
    def self.flag
        JS::global[:P][:_flag]
    end
    def self.addEventListener(name, eventName, &block)
        element = JS::global[:P][name]
        element.addEventListener eventName do |e|
            block.call
        end
    end
    def self.whenFlag(&block)
        _flag = JS::global[:P][:flag]
        _flag.addEventListener "click" do |e|
            puts 'flag clicked'
            fiber = Fiber.new do
                puts 'Fiber in whenFlag'
                block.call
            end
            fiber.resume
        end
    end
#    def self.prepare(&block)
#        yield block
#    end
#    def self.setting(&block)
#        yield block
#    end
    def self.method_missing(method, *params)
        JS::global.call(method, *params)
    end
end