export const showToast = (message) => {
    alert(message);
}

export const zipCodeMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{5})(\d)/,'$1-$2')
    return value
}

export function relativeTime(dataString) {
    // Convertendo a string para um objeto Date
    const dataPost = new Date(dataString);

    // Obtendo a data atual
    const dataAtual = new Date();

    // Calculando a diferença em milissegundos
    const diferencaEmMilissegundos = dataAtual - dataPost;

    // Convertendo a diferença para segundos
    const diferencaEmSegundos = Math.floor(diferencaEmMilissegundos / 1000);

    // Convertendo a diferença para minutos
    const diferencaEmMinutos = Math.floor(diferencaEmSegundos / 60);

    // Convertendo a diferença para horas
    const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);

    // Convertendo a diferença para dias
    const diferencaEmDias = Math.floor(diferencaEmHoras / 24);

    // Verificando a unidade de tempo apropriada
    if (diferencaEmDias > 0) {
        return `Há ${diferencaEmDias} dia(s)`;
    } else if (diferencaEmHoras > 0) {
        return `Há ${diferencaEmHoras} hora(s)`;
    } else if (diferencaEmMinutos > 0) {
        return `Há ${diferencaEmMinutos} minuto(s)`;
    } else {
        return `Há poucos segundos`;
    }
}
