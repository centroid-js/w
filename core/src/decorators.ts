function configurable(value: boolean) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}

function enumerable(value: boolean) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

export {
    configurable,
    enumerable
}