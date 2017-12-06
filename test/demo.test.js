const supertest = require('supertest')
const chai = require('chai')
const app = require('../src/server/app.js')

const expect = chai.expect
const request = supertest(app.listen())

// 测试套件/组
describe('开始测试demo的GET请求', () => {

    // 测试用例
    function greetingMaker (greeting){
        function addName(name){
            return greeting + ' ' + name;
        }
        return addName;
    }
    var dayTimeGreeting = greetingMaker("good day to you");
    for (var i = 0; i < 10000000; i++) {
        dayTimeGreeting('linda');
    }
})