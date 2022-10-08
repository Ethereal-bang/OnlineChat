export const idGetter = (): number => {
    return Number(sessionStorage.getItem("id"));
}

export const idSetter = (id: number): void => {
    sessionStorage.setItem("id", id + '');
}