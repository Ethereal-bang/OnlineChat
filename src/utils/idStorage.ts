export const idGetter = (): number => {
    return Number(localStorage.getItem("id"));
}

export const idSetter = (id: number): void => {
    localStorage.setItem("id", id + '');
}