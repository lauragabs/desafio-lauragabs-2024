class RecintosZoo {
    analisaRecintos(animal, quantidade) {
        const recintosViaveis = [];

        // Informações dos animais e recintos
        const animais = {
            LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
        };

        const recintos = [
            { numero: 1, bioma: ['savana'], tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: ['floresta'], tamanho: 5, animais: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: ['rio'], tamanho: 8, animais: [] },
            { numero: 5, bioma: ['savana'], tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        // Verificar se o animal é válido
        if (!animais[animal]) {
            return { erro: "Animal inválido" };
        }

        const animalInfo = animais[animal];

        // Verificar se a quantidade é válida
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Iterar sobre os recintos
        recintos.forEach((recinto) => {

            // Definir os biomas do recinto 
            const biomasRecinto = recinto.bioma;

            // Verificar se o bioma do recinto é adequado para o animal
            const biomaAdequado = biomasRecinto.some(bioma =>
                animalInfo.bioma.includes(bioma)
            );

            if (!biomaAdequado || (biomasRecinto.length > 1 && animalInfo.bioma.length === 1)) {
                return;
            }

            // Verificar se o recinto já tem animais e se algum deles é carnívoro
            const contemCarnivoroRecinto = recinto.animais.some(animalExistente =>
                animais[animalExistente.especie].carnivoro
            );

            // Verificar se o recinto já tem animais e se algum deles é herbívoro
            const contemHerbivoroRecinto = recinto.animais.some(animalExistente =>
                !animais[animalExistente.especie].carnivoro
            );

            // Se o recinto contém um carnívoro, só pode aceitar o mesmo tipo de animal carnívoro
            if ((!animalInfo.carnivoro && contemCarnivoroRecinto) || (animalInfo.carnivoro && contemHerbivoroRecinto)) {
                return;
            }

            if (animalInfo.carnivoro && contemCarnivoroRecinto) {
                const mesmoAnimalCarnivoro = recinto.animais.filter((animalExistente) => animalExistente?.especie === animal);
                if (Array.isArray(mesmoAnimalCarnivoro) && mesmoAnimalCarnivoro.length === 0) {
                    return;
                }
            }

            // Se o animal é macaco, o recinto deve ter pelo menos outro animal
            if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade <= 1) {
                return;
            }

            // Se o animal é hipopotamo, só é aceito outra especie em savana e rio
            if (animal === 'HIPOPOTAMO' && contemHerbivoroRecinto) {
                const mesmoAnimal = recinto.animais.filter((animalExistente) => animalExistente?.especie === animal);
                if (Array.isArray(mesmoAnimal) && mesmoAnimal.length === 0) {
                    const isSavanaERio = recinto.bioma.includes('savana') && recinto.bioma.includes('rio');

                    if (!isSavanaERio) {
                        return;
                    }
                }
            }

            // Calcular o espaço ocupado pelos animais no recinto, levando em conta a quantidade
            let espacoOcupadoNoRecintoAtual = recinto.animais.reduce((total, animalExistente) =>
                total + animais[animalExistente.especie].tamanho * animalExistente.quantidade, 0);

            const animalDiferenteNoRecinto = recinto.animais.filter((animalExistente) => animalExistente?.especie !== animal);

            if (Array.isArray(animalDiferenteNoRecinto) && animalDiferenteNoRecinto.length > 0) {
                espacoOcupadoNoRecintoAtual++;
            }

            // Calcular o espaço necessário para os novos animais
            const espacoNecessario = quantidade * animalInfo.tamanho;

            // Verificar se há espaço suficiente no recinto
            if (espacoOcupadoNoRecintoAtual + espacoNecessario <= recinto.tamanho) {
                // Adicionar o recinto à lista de recintos viáveis com o espaço livre real
                const espacoLivre = recinto.tamanho - (espacoOcupadoNoRecintoAtual + espacoNecessario);

                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`);
            }

        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordenar recintos por número 
        recintosViaveis.sort((a, b) => {
            const numeroA = parseInt(a.match(/\d+/)[0]);
            const numeroB = parseInt(b.match(/\d+/)[0]);
            return numeroA - numeroB;
        });

        return { recintosViaveis };
    }
}

export { RecintosZoo };
