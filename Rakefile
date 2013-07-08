require 'rbconfig'

# Detect OS
# Used from http://stackoverflow.com/questions/11784109/detecting-operating-systems-in-ruby
def os
    @os ||= (
        host_os = RbConfig::CONFIG['host_os']
        case host_os
        when /mswin|msys|mingw|cygwin|bccwin|wince|emc/
            :windows
        when /darwin|mac os/
            :macosx
        when /linux/
            :linux
        when /solaris|bsd/
            :unix
        else
            raise Error::WebDriverError, "unknown os: #{host_os.inspect}"
        end
    )
end


desc "build client-side"
task :build do
    check 'yapp.js', 'yapp.js', 'http://friendcode.github.io/yapp.js/'
    system 'yapp.js -d public/main build'
    system 'yapp.js -d public/remote build'
end

desc "install dependencies using npm"
task :install do
    check 'npm', 'NPM', 'https://npmjs.org/'
    system 'npm install .'

    # Install YappJS os specfic
    case os()
    when :macosx
        system 'npm install -g git+https://github.com/FriendCode/yapp.js.git#master'
    when :linux || :unix
        system 'sudo -H npm install -g git+https://github.com/FriendCode/yapp.js.git#master'
    end
end

desc "run server"
task :run do
    check 'node', 'node', 'http://nodejs.org/'
    system 'node bin/run.js'
end

task :default => ['build', 'run']

# Check for the existence of an executable.
def check(exec, name, url)
    return unless `which #{exec}`.empty?
    puts "#{name} not found.\nInstall it from #{url}"
    exit
end
