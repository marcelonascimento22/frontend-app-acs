[33mcommit eb1d5ffb328b08a6ffe42f4723a5652cebacefb4[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Sun May 31 15:21:55 2026 -0300

    Exclusao defunction nao utilizada

 src/pages/Usuarios.tsx | 2 [32m+[m[31m-[m
 src/pages/Visitas.tsx  | 3 [32m+[m[31m--[m
 2 files changed, 2 insertions(+), 3 deletions(-)

[33mcommit 989e6c114bed72927d89d3ba77d7d9570f7894e8[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Sun May 31 15:16:52 2026 -0300

    Atualização da função Loanding e Criando a pagina de Gerenciamento da Comorbidade

 package-lock.json                            | 1509 [32m+++++++++++[m[31m---------------[m
 package.json                                 |    2 [32m+[m[31m-[m
 src/App.tsx                                  |    8 [32m+[m[31m-[m
 src/components/MapaZonas.tsx                 |    3 [32m+[m[31m-[m
 src/components/ModalComorbidade.tsx          |  175 [32m+++[m
 src/components/ModalEditPessoa.tsx           |    6 [32m+[m[31m-[m
 src/components/ModalNovaPessoa.tsx           |    5 [32m+[m[31m-[m
 src/components/Navbar.tsx                    |    8 [32m+[m
 src/pages/AcsList.tsx                        |    3 [32m+[m[31m-[m
 src/pages/Atendimentos.tsx                   |    9 [31m-[m
 src/pages/Comorbidades.tsx                   |  240 [32m++++[m
 src/pages/EditarUsuarios.tsx                 |    3 [32m+[m[31m-[m
 src/pages/GestantesList.tsx                  |    3 [32m+[m[31m-[m
 src/pages/Perfil.tsx                         |    3 [32m+[m[31m-[m
 src/pages/PessoaDetalhe.tsx                  |    3 [32m+[m[31m-[m
 src/pages/PessoaList.tsx                     |   25 [32m+[m[31m-[m
 src/pages/Usuarios.tsx                       |    7 [32m+[m[31m-[m
 src/pages/Visitas.tsx                        |  147 [32m+[m[31m--[m
 src/pages/atendimento/Agenda.tsx             |    3 [32m+[m[31m-[m
 src/pages/atendimento/InfoAgendasCriadas.tsx |    3 [32m+[m[31m-[m
 src/pages/pessoaDetalhe/infoComorbidade.tsx  |    3 [32m+[m[31m-[m
 src/pages/pessoaDetalhe/infoPessoa.tsx       |    3 [32m+[m[31m-[m
 src/pages/pessoaDetalhe/infoVacina.tsx       |    3 [32m+[m[31m-[m
 src/pages/vacinacao/VacinasAplicadas.tsx     |    3 [32m+[m[31m-[m
 src/repositories/familiaRepository.ts        |   43 [31m-[m
 src/services/api.ts                          |    2 [32m+[m
 src/services/database.ts                     |   58 [31m-[m
 src/utils/Loading.tsx                        |   12 [32m+[m
 src/utils/TableSkeleton.tsx                  |   12 [32m+[m
 29 files changed, 1222 insertions(+), 1082 deletions(-)

[33mcommit ac8a1178e658c160f0b750af340a9308eca95adb[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Thu May 28 14:04:06 2026 -0300

    Correção criar zonas 2

 src/components/MapaZonas.tsx | 8 [32m+++++++[m[31m-[m
 1 file changed, 7 insertions(+), 1 deletion(-)

[33mcommit 60e98e69389a4b8daf29e3289441f7806266990f[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Thu May 28 13:34:46 2026 -0300

    Correção criar zonas

 src/components/MapaZonas.tsx | 28 [32m++++++++++++++++[m[31m------------[m
 1 file changed, 16 insertions(+), 12 deletions(-)

[33mcommit 0d1b7887b7992cf8e502e6d3f0db76902354bb42[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Thu May 28 00:15:15 2026 -0300

    Add varsão mobila da tabela de visitas

 src/pages/Visitas.tsx | 249 [32m+++++++++++++++++++++++++++++++++++[m[31m---------------[m
 1 file changed, 175 insertions(+), 74 deletions(-)

[33mcommit 94584e252821a21e94aef81eb90006ca4a318375[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Wed May 27 23:54:32 2026 -0300

    Correção data visita undefined

 src/pages/Visitas.tsx | 7 [32m++++++[m[31m-[m
 1 file changed, 6 insertions(+), 1 deletion(-)

[33mcommit e0477cf1dc71924c0e337a86247fd2deffb8251d[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Wed May 27 17:13:45 2026 -0300

    Removendo submodule acidental frontend-web

 frontend-web | 1 [31m-[m
 1 file changed, 1 deletion(-)

[33mcommit aa65c916ae4ed32823eb25406fc154cc1b8bcab8[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Wed May 27 16:55:41 2026 -0300

    Separando e Limpado projeto web do mobile android

 android/.gitignore                                 | 101 [31m---------[m
 android/app/.gitignore                             |   2 [31m-[m
 android/app/build.gradle                           |  54 [31m-----[m
 android/app/capacitor.build.gradle                 |  19 [31m--[m
 android/app/proguard-rules.pro                     |  21 [31m--[m
 .../myapp/ExampleInstrumentedTest.java             |  26 [31m---[m
 android/app/src/main/AndroidManifest.xml           |  45 [31m----[m
 .../src/main/java/com/acs/app/MainActivity.java    |  22 [31m--[m
 .../app/src/main/res/drawable-land-hdpi/splash.png | Bin [31m7705[m -> [32m0[m bytes
 .../app/src/main/res/drawable-land-mdpi/splash.png | Bin [31m4040[m -> [32m0[m bytes
 .../src/main/res/drawable-land-xhdpi/splash.png    | Bin [31m9251[m -> [32m0[m bytes
 .../src/main/res/drawable-land-xxhdpi/splash.png   | Bin [31m13984[m -> [32m0[m bytes
 .../src/main/res/drawable-land-xxxhdpi/splash.png  | Bin [31m17683[m -> [32m0[m bytes
 .../app/src/main/res/drawable-port-hdpi/splash.png | Bin [31m7934[m -> [32m0[m bytes
 .../app/src/main/res/drawable-port-mdpi/splash.png | Bin [31m4096[m -> [32m0[m bytes
 .../src/main/res/drawable-port-xhdpi/splash.png    | Bin [31m9875[m -> [32m0[m bytes
 .../src/main/res/drawable-port-xxhdpi/splash.png   | Bin [31m13346[m -> [32m0[m bytes
 .../src/main/res/drawable-port-xxxhdpi/splash.png  | Bin [31m17489[m -> [32m0[m bytes
 .../res/drawable-v24/ic_launcher_foreground.xml    |  34 [31m---[m
 .../main/res/drawable/ic_launcher_background.xml   | 170 [31m--------------[m
 android/app/src/main/res/drawable/splash.png       | Bin [31m4040[m -> [32m0[m bytes
 android/app/src/main/res/layout/activity_main.xml  |  12 [31m-[m
 .../src/main/res/mipmap-anydpi-v26/ic_launcher.xml |   5 [31m-[m
 .../res/mipmap-anydpi-v26/ic_launcher_round.xml    |   5 [31m-[m
 .../app/src/main/res/mipmap-hdpi/ic_launcher.png   | Bin [31m2786[m -> [32m0[m bytes
 .../res/mipmap-hdpi/ic_launcher_foreground.png     | Bin [31m3450[m -> [32m0[m bytes
 .../src/main/res/mipmap-hdpi/ic_launcher_round.png | Bin [31m4341[m -> [32m0[m bytes
 .../src/main/res/mipmap-hdpi/icone_app_redondo.png | Bin [31m1450527[m -> [32m0[m bytes
 .../app/src/main/res/mipmap-mdpi/ic_launcher.png   | Bin [31m1869[m -> [32m0[m bytes
 .../res/mipmap-mdpi/ic_launcher_foreground.png     | Bin [31m2110[m -> [32m0[m bytes
 .../src/main/res/mipmap-mdpi/ic_launcher_round.png | Bin [31m2725[m -> [32m0[m bytes
 .../app/src/main/res/mipmap-xhdpi/ic_launcher.png  | Bin [31m3981[m -> [32m0[m bytes
 .../res/mipmap-xhdpi/ic_launcher_foreground.png    | Bin [31m5036[m -> [32m0[m bytes
 .../main/res/mipmap-xhdpi/ic_launcher_round.png    | Bin [31m6593[m -> [32m0[m bytes
 .../app/src/main/res/mipmap-xxhdpi/ic_launcher.png | Bin [31m6644[m -> [32m0[m bytes
 .../res/mipmap-xxhdpi/ic_launcher_foreground.png   | Bin [31m9793[m -> [32m0[m bytes
 .../main/res/mipmap-xxhdpi/ic_launcher_round.png   | Bin [31m10455[m -> [32m0[m bytes
 .../src/main/res/mipmap-xxxhdpi/ic_launcher.png    | Bin [31m9441[m -> [32m0[m bytes
 .../res/mipmap-xxxhdpi/ic_launcher_foreground.png  | Bin [31m15529[m -> [32m0[m bytes
 .../main/res/mipmap-xxxhdpi/ic_launcher_round.png  | Bin [31m15916[m -> [32m0[m bytes
 .../src/main/res/values/ic_launcher_background.xml |   4 [31m-[m
 android/app/src/main/res/values/strings.xml        |   7 [31m-[m
 android/app/src/main/res/values/styles.xml         |  22 [31m--[m
 android/app/src/main/res/xml/file_paths.xml        |   5 [31m-[m
 .../src/main/res/xml/network_security_config.xml   |   7 [31m-[m
 .../com/getcapacitor/myapp/ExampleUnitTest.java    |  18 [31m--[m
 android/build.gradle                               |  29 [31m---[m
 android/capacitor.settings.gradle                  |   6 [31m-[m
 android/gradle.properties                          |  26 [31m---[m
 android/gradle/wrapper/gradle-wrapper.jar          | Bin [31m43764[m -> [32m0[m bytes
 android/gradle/wrapper/gradle-wrapper.properties   |   7 [31m-[m
 android/gradlew                                    | 251 [31m---------------------[m
 android/gradlew.bat                                |  94 [31m--------[m
 android/settings.gradle                            |   5 [31m-[m
 android/variables.gradle                           |  16 [31m--[m
 frontend-web                                       |   1 [32m+[m
 56 files changed, 1 insertion(+), 1013 deletions(-)

[33mcommit c2f83f2f3b8cd7c7780fd6376f04f13cf067b0b9[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Wed May 27 16:12:05 2026 -0300

    Add conexão com a rota test 2

 src/services/api.ts | 29 [32m++++++++++++++++++++[m[31m---------[m
 1 file changed, 20 insertions(+), 9 deletions(-)

[33mcommit 97c690ecc2a22e03ef80cb39f3c991abaabcf672[m
Author: Marcelo Nascimento <marcelo.augustonasci@gmail.com>
Date:   Wed May 27 16:08:34 2026 -0300

    Add conexão com a rota test

 src/components/Navbar.tsx | 4 [32m++[m[31m--[m
 src/services/api.ts       | 9 [32m+++++++++[m
 2 files changed, 11 insertions(+), 2 deletions(-)
