/**
 *
 * Created by Borbás Geri on 2/18/14
 * Copyright (c) 2014 eppz! development, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */


var A = Class.extend
({
    className: 'A',
    aCanDo: function()
    { return true; },
});

var B = A.extend
({
    className: 'B',
    bCanDo: function()
    { return true; },
});

var C = B.extend
({
    className: 'C',
    cCanDo: function()
    {  return true; },

});


describe('Class inheritance', function()
{
    it('should work.', function()
    {
        A.should.respondTo('aCanDo');
        B.should.respondTo('aCanDo');
        B.should.respondTo('bCanDo');
        C.should.respondTo('aCanDo');
        C.should.respondTo('bCanDo');
        C.should.respondTo('cCanDo');
    });
});