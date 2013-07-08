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
    system 'npm install -g git+ssh://git@github.com:FriendCode/yapp.js.git#master'
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