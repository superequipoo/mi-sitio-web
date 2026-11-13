from flask import Flask, render_template, request, redirect, url_for, session, flash, g
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__)
app.secret_key = "comando-azul-2026"

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'instance', 'usuarios.db')

def get_db():
    if 'db' not in g:
        os.makedirs(os.path.join(basedir, 'instance'), exist_ok=True)
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
        g.db.execute('''CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT NOT NULL,
            usuario TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )''')
        g.db.commit()
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    db = get_db()
    total = db.execute('SELECT COUNT(*) as c FROM usuario').fetchone()['c']
    return render_template('index.html', total_usuarios=total, usuario=session.get("usuario_logueado"))

@app.route('/registro', methods=['GET', 'POST'])
def registro():
 
    if request.method == 'GET' and "usuario_logueado" in session:
        session.clear()

    if request.method == 'POST':
        nombre = request.form.get('nombre','').strip()
        correo = request.form.get('correo','').strip()
        usuario = request.form.get('usuario','').strip()
        password = request.form.get('password','')

        db = get_db()
        existe = db.execute('SELECT * FROM usuario WHERE usuario=? OR correo=?',(usuario, correo)).fetchone()
        if existe:
            flash("Ese usuario o correo ya existe", "error")
            return redirect(url_for('registro'))

        db.execute('INSERT INTO usuario (nombre,correo,usuario,password) VALUES (?,?,?,?)',
                   (nombre, correo, usuario, generate_password_hash(password)))
        db.commit()
        session["usuario_logueado"] = {"nombre": nombre, "usuario": usuario}
        return redirect(url_for('index'))

    return render_template('registro.html', usuario=session.get("usuario_logueado"))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario','').strip()
        password = request.form.get('password','')
        db = get_db()
        u = db.execute('SELECT * FROM usuario WHERE usuario=?',(usuario,)).fetchone()
        if u and check_password_hash(u['password'], password):
            session['usuario_logueado'] = u['usuario']
            session['nombre_logueado'] = u['nombre']
            return redirect(url_for('index'))
        flash("Usuario o contraseña incorrectos", "error")
        return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))
#-------------------------------------------------------------
#seccion ver usuarios
@app.route('/ver_usuarios')
def ver_usuarios():
    db = get_db()
    todos = db.execute('SELECT * FROM usuario').fetchall()
    return render_template('ver_usuarios.html', usuarios=todos)

#-----------------------------------------------------------------

#--------------------------LENGUA Y COMUNICACION-------------------

@app.route('/lengua')
def lengua():
    if "usuario_logueado" not in session:
        return redirect(url_for('login'))
    return render_template('lengua.html', usuario=session.get("usuario_logueado"))

@app.route('/examen_lengua')
def examen_lengua():
    return render_template('examen_lengua.html')

@app.route('/tiposlectura')
def tiposlectura():
    return render_template('tiposlectura.html')


@app.route('/aventura')
def aventura():
    return render_template('aventura_lengua.html')

@app.route('/fantasia')
def fantasia():
    return render_template('fantasia.html')

@app.route('/terror')
def terror():
    return render_template('terror.html')

@app.route('/misterio')
def misterio():
    return render_template('misterio.html')

#-------------------------------------------------

# seccion videojuegos_lengua1
@app.route('/videojuegos_lengua')
def videojuegos_lengua():
    return render_template('videojuegos_lengua.html')

@app.route('/sopa_letras')
def sopa_letras():
    return render_template('sopa_letras.html')

@app.route('/ahorcado')
def ahorcado():
    return render_template('ahorcado.html')

@app.route('/ejercicios_lengua')
def ejercicios_lengua():
    return render_template('ejercicios_lengua.html')

#-----------------------------------------------------
#seccion ortografia1
@app.route('/ejercicios_ortografia')
def ejercicios_ortografia():
    return render_template('ejercicios_ortografia.html')

@app.route('/B_y_V')
def B_y_V():
    return render_template('B_y_V.html')

@app.route('/s_c_z')
def s_c_z():
    return render_template('s_c_z.html')

@app.route('/h')
def h():
    return render_template('h.html')

@app.route('/acentuacion')
def acentuacion():
    return render_template('acentuacion.html')

#------------------------------------------------------------

#seccion gramatica1
@app.route('/ejercicios_gramatica')
def ejercicios_gramatica():
    return render_template('ejercicios_gramatica.html')

@app.route('/gramatica_sujeto_predicado')
def gramatica_sujeto_predicado():
    return render_template('gramatica_sujeto_predicado.html')

@app.route('/gramatica_objeto')
def gramatica_objeto():
    return render_template('gramatica_objeto.html')

@app.route('/gramatica_categorias')
def gramatica_categorias():
    return render_template('gramatica_categorias.html')

@app.route('/gramatica_oracion')
def gramatica_oracion():
    return render_template('gramatica_oracion.html')

#-----------------------------------------------------

#seccion comprencion1
@app.route('/ejercicios_comprension')
def ejercicios_comprension():
    return render_template('ejercicios_comprension.html')

@app.route('/comprension_idea_principal')
def comprension_idea_principal():
    return render_template('comprension_idea_principal.html')

@app.route('/comprension_inferencia')
def comprension_inferencia():
    return render_template('comprension_inferencia.html')

@app.route('/comprension_vocabulario')
def comprension_vocabulario():
    return render_template('comprension_vocabulario.html')

#---------------------------------------------------

#seccion semantica1
@app.route('/ejercicios_semantica')
def ejercicios_semantica():
    return render_template('ejercicios_semantica.html')

@app.route('/sinonimos_antonimos')
def sinonimos_antonimos():
    return render_template('sinonimos_antonimos.html')

@app.route('/homonimos_paronimos')
def homonimos_paronimos():
    return render_template('homonimos_paronimos.html')

@app.route('/campo_sematico')
def campo_sematico():
    return render_template('campo_sematico.html')


#----------------------------------------------------

#seccion literatura1
@app.route('/ejercicios_literatura')
def ejercicios_literatura():
    return render_template('ejercicios_literatura.html')

@app.route('/generos_literarios')
def generos_literarios():
    return render_template('generos_literarios.html')

@app.route('/figuras_retoricas')
def figuras_retoricas():
    return render_template('figuras_retoricas.html')

@app.route('/corrientes_literarias')
def corrientes_literarias():
    return render_template('corrientes_literarias.html')

#----------------------------------------------------

#seccion redaccion1
@app.route('/ejercicios_redaccion')
def ejercicios_redaccion():
    return render_template('ejercicios_redaccion.html')

@app.route('/tipos_de_texto')
def tipos_de_texto():
    return render_template('tipos_de_texto.html')

@app.route('/conectores_logicos')
def conectores_logicos():
    return render_template('conectores_logicos.html')

@app.route('/coherencia_cohesion')
def coherencia_cohesion():
    return render_template('coherencia_cohesion.html')













# -----------------------MATEMATICAS----------------------------------------

@app.route('/matematicas')
def matematicas():
    if "usuario_logueado" not in session:
        return redirect(url_for('login'))
    return render_template('matematicas.html', usuario=session.get("usuario_logueado"))

#-------------------------------------------------------------------

@app.route('/juegos_matematicas')
def juegos_matematicas():
    return render_template('juegos_matematicas.html')

@app.route('/calculo_veloz')
def calculo_veloz():
    return render_template('calculo_veloz.html')


@app.route('/atrapa_el_resultado')
def atrapa_el_resultado():
    return render_template('atrapa_el_resultado.html')

@app.route('/rompe_la_ecuacion')
def rompe_la_ecuacion():
    return render_template('rompe_la_ecuacion.html')

#-------------------------------------------------

@app.route('/operaciones_matematicas')
def operaciones_matematicas():
    return render_template('operaciones_matematicas.html')

@app.route('/potencias_y_raizez')
def potencias_y_raizez():
    return render_template('potencias_y_raizez.html')

@app.route('/fracciones_y_decimales_tacticos')
def fracciones_y_decimales_tacticos():
    return render_template('fracciones_y_decimales_tacticos.html')

@app.route('/porsentajes_y_descuentos')
def porsentajes_y_descuentos():
    return render_template('porsentajes_y_descuentos.html')

@app.route('/algebra_y_pitagoras')
def algebra_y_pitagoras():
    return render_template('algebra_y_pitagoras.html')

#------------------------------------------------------



@app.route('/desafio_matematicas')
def desafio_matematicas():
    return render_template('desafio_matematicas.html')

@app.route('/desafio_algebra_pitagoras')
def desafio_algebra_pitagoras():
    return render_template('desafio_algebra_pitagoras.html')

@app.route('/desafio_potencias_raices')
def desafio_potencias_raices():
    return render_template('desafio_potencias_raices.html')

@app.route('/desafio_fracciones_decimales')
def desafio_fracciones_decimales():
    return render_template('desafio_fracciones_decimales.html')

@app.route('/desafio_porcentajes_descuentos')
def desafio_porcentajes_descuentos():
    return render_template('desafio_porcentajes_descuentos.html')


#-----------------------------------------------------

@app.route('/examen_matematicas')
def examen_matematicas():
    return render_template('examen_matematicas.html')
#-------------------------------------------------------


if __name__ == '__main__':
    app.run(debug=True)