/**
 * JVM Wrapper
 * @private
 */
export class JVM{
    /**
     * Reflection된 Java Class 보관소
     * @type {Object.<string, Object>}
     * @private
     */
    static _classes = {};

    /**
     * 시스템에서 사용하는 JVM Instance
     */
    static INSTANCE;

    /**
     * Node-java에서 사용하는 JVM interface
     * @private
     * @type {Object}
     */
    java;

    constructor(java){
        if(typeof java === 'undefined' || java === null || JVM.INSTANCE)
            throw TypeError('java는 null일 수 없고, JVM.init()은 한 번만 실행되어야 합니다.');
        this.java = java;
        JVM.INSTANCE = this;
    }

    static init(java){
        if(JVM.INSTANCE)
            return JVM.INSTANCE;
        else
            return new JVM(java);
    }

    /**
     * Java class 반환
     * @param {!string} path Class package path
     * @returns {Object} Java class
     */
    static classOf(...path){
        let clsName = path.join('.');

        if(!JVM._classes.hasOwnProperty(clsName))
            JVM._classes[clsName] = JVM.INSTANCE.java.import(clsName);

        return JVM._classes[clsName];
    }

    /**
     * Koala Class 반환
     * @param {!string} path Class package path
     * @returns {Object} Java class
     */
    static koalaClassOf(...path){
        return JVM.classOf('kr.bydelta.koala', ...path);
    }

    /**
     * Koala Enum 반환
     * @param {!string} tagset 표지자 집합 클래스 이름
     * @param {?string} tag 표지자 이름
     * @returns {?Object} 표지자 이름에 맞는 Java Enum
     */
    static koalaEnumOf(tagset, tag){
        if (tag !== null && typeof tag !== 'undefined')
            return JVM.koalaClassOf(tagset).valueOf(tag);
        else return null;
    }

    /**
     * Java Iterable -> JSON Array
     * @param {Object} array
     * @param itemConverter
     * @returns {Array}
     */
    static toJsArray(array, itemConverter=(x) => x){
        if(typeof array === "undefined" || array === null)
            return [];
        if(Array.isArray(array))
            return array.map(itemConverter);

        let result = [];
        let it = array.iterator();
        while(it.hasNext()){
            result.push(itemConverter(it.next()));
        }

        return result;
    }

    /**
     * Java Map -> JSON Object
     * @param {Object} obj
     * @param keyConverter
     * @param valueConverter
     * @return {Object}
     */
    static toJSON(obj, keyConverter=(x) => x, valueConverter=(x) => x){
        let result = {};
        let keys = obj.entrySet().iterator();

        while(keys.hasNext()){
            let entry = keys.next();

            result[keyConverter(entry.getKey())] = valueConverter(entry.getValue());
        }

        return result;
    }

    /**
     * JSON Array -> Java List
     * @param {Object[]} array
     */
    static listOf(array){
        let list = new (JVM.classOf('java.util.ArrayList'))();

        for(const item of array)
            list.add(item);

        return list;
    }

    /**
     * Make Java Pair
     * @param {Object} a First entry
     * @param {Object} b Second entry
     */
    static pair(a, b){
        return new (JVM.classOf('kotlin.Pair'))(a, b);
    }

    /**
     * Make Java Char
     * @param {?string} ch Character
     * @returns {Object} Java Character
     */
    static char(ch){
        if (ch !== null && typeof ch !== 'undefined')
            return JVM.INSTANCE.java.newChar(ch.charCodeAt(0));
        else return null;
    }

    /**
     * Make Java Set
     * @param {Object[]} array Items
     * @returns {Object} Java Set
     */
    static setOf(array){
        let list = new (JVM.classOf('java.util.HashSet'))();

        for(const item of array)
            list.add(item);

        return list;
    }
    static posFilter(posSet){
        return JVM.INSTANCE.java.newProxy('kotlin.jvm.functions.Function1', {
            'invoke': function(tag){
                return posSet.includes(tag.name());
            }
        });
    }
}